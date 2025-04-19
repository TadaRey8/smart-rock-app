import machine
import time
import network
import socket

motor_pin = machine.Pin(15, machine.Pin.OUT)

SSID = "your-ssid"
PASSWORD = "your-password"

def connect_wifi():
    wlan = network.WLAN(network.STA_IF)
    wlan.active(True)
    wlan.connect(SSID, PASSWORD)
    while not wlan.isconnected():
        time.sleep(1)
    print("Connected to Wi-Fi:", wlan.ifconfig())

def unlock_door():
    motor_pin.on()
    time.sleep(2)
    motor_pin.off()

def start_server():
    addr = socket.getaddrinfo('0.0.0.0', 8080)[0][-1]
    s = socket.socket()
    s.bind(addr)
    s.listen(1)
    print("Listening on", addr)

    while True:
        cl, addr = s.accept()
        print("Client connected from", addr)
        request = cl.recv(1024)
        if b"UNLOCK" in request:
            unlock_door()
        cl.close()

connect_wifi()
start_server()