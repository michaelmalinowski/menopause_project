#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include "wifiSecrets.h"

ESP8266WiFiMulti WiFiMulti;

int power = 0;
String key = String(API_KEY);

void setup() {
    //pin 13 is Digital Pin 7 (D7)
    pinMode(13, OUTPUT);
    pinMode(5, OUTPUT);
    analogWrite(5, LOW);
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP(WIFI_NAME, WIFI_PASS);
    Serial.println("Start");
}

//This loop ping the server every 5 seconds to determine if the fan status has changed
void loop() {
    if((WiFiMulti.run() == WL_CONNECTED)) {

        HTTPClient http;

        //A get request for the status of the device. 
        String url = "http://34.66.131.1/getCharacteristic?key="+ key +"&deviceName=Fan&characteristic=Status";
        http.begin(url); //HTTP
          
        int statusCode = http.GET();
        if(statusCode > 0) {
            if(statusCode == 200) {
                String payload = http.getString();
                Serial.println(payload);
                if (power == 0 && payload == "on") {
                  power = 1;
                  analogWrite(5, 1000);
                  analogWrite(13, 1000);
                } else if (power == 1 && payload == "off") {
                  power = 0;
                  analogWrite(5, 0);
                  analogWrite(13, 0); 
                }
            }
        } 
        http.end();
    }
    delay(5000);
}
