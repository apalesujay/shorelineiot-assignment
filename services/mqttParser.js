import { connect } from "mqtt";
import { isInt, isEmpty } from "../utils/validator.js";
import config from '../index.js';

const topic =
    "mqtt_client_id" | "mqtt_port" | "mqtt_host" | "verbosity" | "config_file";

export const parseMqtt = () => {
    const client = connect("mqtt://broker.mqttdashboard.com");
    const mqttOptions = {};
    const configFileOptions = {};

    const topics = [
        "mqtt_client_id",
        "mqtt_port",
        "mqtt_host",
        "verbosity",
        "config_file",
    ];

    client.on("connect", () => {
        topics.forEach((topic) => {
            client.subscribe(`/module/config/param/${topic}`, {
                qos: 1,
                retain: true,
            });
        });
    });

    client.on("message", (topic, message) => {
        const option = topic.substring(topic.lastIndexOf("/") + 1);

        // message is buffer
        const value = message.toString();

        switch (option) {
            case "mqtt_client_id":
                // Throw error if the value of mqtt_client_id is not an empty string
                if (isEmpty(value)) {
                    console.log(
                        `Error(MQTT): ${option} accepts only non empty string values`
                    );
                    process.exit(1);
                }

                mqttOptions[option] = value;
                break;

            case "mqtt_port":
                // Throw error f the value of mqtt_port is not an integer
                if (!isInt(value)) {
                    console.log(`Error(MQTT): ${option} accepts only integer values`);
                    process.exit(1);
                }

                mqttOptions[option] = parseInt(value);
                break;

            case "mqtt_host":
                // Throw error if the value of mqtt_host is not an empty string
                if (isEmpty(value)) {
                    console.log(
                        `Error(MQTT): ${option} accepts only non empty string values`
                    );
                    process.exit(1);
                }

                mqttOptions[option] = value;
                break;

            case "verbosity":
                // Throw error f the value of verbosity is not an integer
                if (!isInt(value)) {
                    console.log(`Error(MQTT): ${option} accepts only integer values`);
                    process.exit(1);
                }

                mqttOptions[option] = parseInt(value);
                break;

            case "config_file":
                if (!isEmpty(value)) {
                    conFigFileOptions = parseFile(configFileOptions.config_file);
                }

                mqttOptions[option] = value;
                break;

            default:
                // Throw error if parameter is not a standard option
                console.log(
                    `Error(MQTT): Parameter ${option} is not a standard option`
                );
                process.exit(1);
        }

        const configObj = Object.assign({}, configFileOptions, config, mqttOptions);

        console.log(configObj);
    
        client.publish('/module/config', JSON.stringify(configObj), { qos: 1, retain: true });
    });
};
