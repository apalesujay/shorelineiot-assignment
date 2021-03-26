import commandLineArgs from 'command-line-args';
import { isEmpty, isInt } from '../utils/validator.js';
import { parseFile } from './fileParser.js';

export const parseCommandLine = () => {
    try {
        const commandLineOptionDefinitions = [
            { name: 'mqtt_client_id', alias: 'C', type: String },
            { name: 'mqtt_port', alias: 'p', type: Number },
            { name: 'mqtt_host', alias: 'h', type: String},
            { name: 'verbosity', alias: 'v', type: Number },
            { name: 'config_file', alias: 'c', type: String }
        ];
        
        const commandLineOptions = commandLineArgs(commandLineOptionDefinitions);
    
        let configFileOptions;

        // Throw error if mqtt_port is not an integer
        if (commandLineOptions.mqtt_port && !isInt(commandLineOptions.mqtt_port)) {
            throw new Error(`Error(Command Line): Parameter mqtt_port accepts only integer values`);
        }
    
        // Throw error if verbosity is not an integer
        if (commandLineOptions.verbosity && !isInt(commandLineOptions.verbosity)) {
            throw new Error(`Error(Command Line): Parameter verbosity accepts only integer values`);
        }
    
        // Throw error if mqtt_client_id is an empty string
        if (commandLineArgs.mqtt_client_id && isEmpty(commandLineOptions.mqtt_client_id)) {
            throw new Error(`Error(Command Line): Parameter mqtt_client_id accepts only non empty string values`);
        }
    
        // Throw error if mqtt_host is an empty string
        if (commandLineOptions.mqtt_host && isEmpty(commandLineOptions.mqtt_host)) {
            throw new Error(`Error(Command Line): Parameter mqtt_host accepts only non empty string values`);
        }

        // If config_file option is set then parse the options from the specified config file
        if (commandLineOptions.config_file && !isEmpty(commandLineOptions.config_file)) {
            configFileOptions =  parseFile(commandLineOptions.config_file);
        }
    
        // Creates the configuration object based on the priority:
        // MQTT values > command line values > config_file value > config.conf values > default values
        return Object.assign({}, configFileOptions, commandLineOptions);

    } catch (error) {
        const message = error.message;
        let option;

        // Show error if same option is set multiple times in the command line
        if (message.includes('Singular')) {
            option = message.slice(message.indexOf('['), message.indexOf(']'));

            console.log(`Error(Command Line): Parameter ${ option } already set`);
        
        // Show error if a parameter is not a standard option
        } else if (message.includes('Unknown')) {
            option = message.split(': ')[1].replace(/-/g, '');

            console.log(`Error(Command Line): Parameter ${ option } is not a standard option`);
        } else {
            console.log(error.message);
        }

        // Exit the process
        process.exit(1);
    }
}