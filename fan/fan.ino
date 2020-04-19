#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
#include "wifiSecrets.h"

ESP8266WiFiMulti WiFiMulti;

int power = 0;
String key = String(API_KEY);

void setup() {
    pinMode(13, OUTPUT);
    Serial.begin(115200);
    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP(WIFI_NAME, WIFI_PASS);
}

void loop() {
    if((WiFiMulti.run() == WL_CONNECTED)) {

        HTTPClient http;

        //A get request for the status of the device. 
        http.begin("http://34.66.131.1/getCharacteristic?key="+ key +"&deviceName=Fan&characteristic=Status"); //HTTP

        int statusCode = http.GET();

        if(statusCode > 0) {
            if(statusCode == 200) {
                String payload = http.getString();

                if (power == 0 && payload == "on") {
                  power = 1;
                  analogWrite(13, 1000);
                } else if (power == 1 && payload == "off") {
                  power = 0;
                  analogWrite(13, 0); 
                }
            }
        } 
        http.end();
    }
    delay(5000);
}
