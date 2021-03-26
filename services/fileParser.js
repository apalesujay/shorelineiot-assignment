import { readFileSync } from 'fs';

import { isInt, isEmpty } from '../utils/validator.js';

export const parseFile = (path) => {
    const configFileName = path.substring(path.lastIndexOf('/') + 1);
    const configFileExtension = path.substring(path.lastIndexOf('.') + 1);

    try {
        // Throw error if configuration file has extension other than .conf
        if (configFileExtension !== 'conf') {
            throw new Error(`Configuration file must have .conf extension`)
        }

        const allowedOptions = [
            'mqtt_client_id',
            'mqtt_port',
            'mqtt_host',
            'verbosity',
            'config_file',
            'C',
            'p',
            'h',
            'v',
            'c'
        ];
    
        const fileData = readFileSync(path).toString().split('\n');
    
        const fileOptions = {};
        
        let conFigFileOptions;

        fileData.forEach(item => {
            const parsedData = item.split('=');
            let option = parsedData[0];

            // Return if the file is empty
            if (option === '') {
                return;
            }
    
            // Throw error if a parameter is not a standard option
            if (!allowedOptions.includes(option)) {
                throw new Error(`Error(${configFileName}): Parameter ${ option } is not a standard option`);
            }
    
            let optionIndex = allowedOptions.indexOf(option);
    
            if (optionIndex > 4) {
                optionIndex = optionIndex - 5;
            }
    
            option = allowedOptions[optionIndex];
    
            const value = parsedData[1];
    
            // Throw error if same option is set multiple times in the configurtion file
            if (fileOptions.hasOwnProperty(option)) {
                throw new Error(`Error(${configFileName}): Parameter ${ option } already set`);
            }
    
            // If option is mqtt_port or verbosity
            if (option === 'mqtt_port' || option === 'verbosity') {
                // Throw error f the value of mqtt_port or verbosity is not an integer
                if (!isInt(value)) {
                    throw new Error(`Error(${configFileName}): ${ option } accepts only integer values`);
                }
    
                fileOptions[option] = parseInt(value);

            // If option is mqtt_client_id or mqtt_host
            } else if (option === 'mqtt_client_id' || option === 'mqtt_host') {
                
                // Throw error if the value of mqtt_client_id or mqtt_host is not an empty string
                if (isEmpty(value)) {
                    throw new Error(`Error(${configFileName}): ${ option } accepts only non empty string values`);
                }
    
                fileOptions[option] = value;
            } else {
                fileOptions[option] = value;
            }

            // If config_file option is set then parse the options from the specified config file
            if (fileOptions.config_file && !isEmpty(fileOptions.config_file)) {
                conFigFileOptions = parseFile(fileOptions.config_file);
            }
        });
    
        // Creates the configuration object based on the priority:
        // MQTT values > command line values > config_file value > config.conf values > default values
        return Object.assign({}, conFigFileOptions, fileOptions);
    } catch (error) {
        const { message } = error;

        // Show every error except file not found error
        if (!message.includes('ENOENT')) {
            console.log(message);
            process.exit(1);
        }
    }
}