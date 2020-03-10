//##########################################################
//THIS CODE NEEDS TO BE REFACTORED #########################
//##########################################################
#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ESP8266HTTPClient.h>

#define USE_SERIAL Serial

ESP8266WiFiMulti WiFiMulti;

int power = 0;

void setup() {
    pinMode(13, OUTPUT);
    USE_SERIAL.begin(115200);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for(uint8_t t = 4; t > 0; t--) {
        USE_SERIAL.printf("[SETUP] WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }

    WiFi.mode(WIFI_STA);
    WiFiMulti.addAP("Amigo", "ginatony");

}

void loop() {
    // wait for WiFi connection
    if((WiFiMulti.run() == WL_CONNECTED)) {

        HTTPClient http;

        USE_SERIAL.print("[HTTP] begin...\n");
        // configure traged server and url
        http.begin("http://34.66.131.1/getCharacteristic?key=3sappE45EtYWb/C/JL8Ejc48nP1hReZyYoI3QIlMF/VLrrsHvcIU1I464JPnoukGijHYSy53BfV2TQfhVbndA==&deviceName=Light&characteristic=Power"); //HTTP

        USE_SERIAL.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
                if (power == 0 && payload == "on") {
                  USE_SERIAL.println("Turning on");
                  power = 1;
                  
                  digitalWrite(13, HIGH);
                  delay(100);
                  digitalWrite(13, LOW);
                  
                } else if (power == 1 && payload == "off") {
                  USE_SERIAL.println("Turning off");
                  power = 0;
                  digitalWrite(13, HIGH);
                  delay(100);
                  digitalWrite(13, LOW);
                }
            }
        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
        }

        http.end();
    }

    delay(2000);
}
