import { parseCommandLine } from './services/commandLineParser.js';
import { parseFile } from './services/fileParser.js';
import { parseMqtt } from './services/mqttParser.js'

// Default values of config options
const defaultOptions = {
    mqtt_client_id: 'client-1',
    mqtt_port: 1883,
    mqtt_host: 'localhost',
    verbosity: 0,
    config_file: ""
};

const commandLineOptions = parseCommandLine();
const configFileOptions = parseFile('./config.conf');

// Creates the configuration object based on the priority:
// MQTT values > command line values > config_file value > config.conf values > default values
let config = Object.assign({}, defaultOptions, configFileOptions, commandLineOptions);

export default config;

parseMqtt();