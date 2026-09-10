import threading
import time
import json
from paho.mqtt import client as mqtt

BROKER = "localhost"
PORT = 1883

client = mqtt.Client()
client.connect(BROKER, PORT)

running = False


def flood_packets(topic: str, rate: int):
    global running

    while running:
        payload = {
            "device": topic,
            "packet_type": "dos_attack",
            "timestamp": time.time(),
            "attack": "DoS Flood"
        }

        client.publish(topic, json.dumps(payload))
        time.sleep(1 / rate)


def start_dos_attack(topic="farm/soil", rate=100):
    global running

    running = True

    thread = threading.Thread(
        target=flood_packets,
        args=(topic, rate),
        daemon=True,
    )

    thread.start()


def stop_dos_attack():
    global running
    running = False