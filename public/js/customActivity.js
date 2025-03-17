'use strict';

let connection = new Postmonger.Session();
let payload = {};
let steps = {};
let currentStep = null;
let activityKey = 'MY_CUSTOM_ACTIVITY';

$(window).ready(onRender);

connection.on('initActivity', initialize);
connection.on('requestedTokens', onGetTokens);
connection.on('requestedEndpoints', onGetEndpoints);
connection.on('clickedNext', onClickedNext);
connection.on('clickedBack', onClickedBack);
connection.on('gotoStep', onGotoStep);

function onRender() {
    // JB will respond with initActivity
    connection.trigger('ready');
}

function initialize(data) {
    if (data) {
        payload = data;
    }
    
    let hasInArguments = Boolean(
        payload['arguments'] &&
        payload['arguments'].execute &&
        payload['arguments'].execute.inArguments &&
        payload['arguments'].execute.inArguments.length > 0
    );

    let inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

    $.each(inArguments, function(index, inArgument) {
        $.each(inArgument, function(key, val) {
            if (key === 'message') {
                $('#message').val(val);
            }
        });
    });

    connection.trigger('updateButton', {
        button: 'next',
        text: 'suivant',
        visible: true
    });
}

function onClickedNext() {
    if (currentStep.key === 'step1') {
        $('#summaryMessage').text($('#message').val());
        connection.trigger('nextStep');
    } else if (currentStep.key === 'step2') {
        save();
    }
}

function onClickedBack() {
    connection.trigger('prevStep');
}

function onGotoStep(step) {
    showStep(step);
    connection.trigger('ready');
}

function showStep(step) {
    currentStep = step;

    $('.step').hide();
    
    switch(currentStep.key) {
        case 'step1':
            $('#step1').show();
            connection.trigger('updateButton', {
                button: 'next',
                text: 'suivant',
                visible: true
            });
            break;
        case 'step2':
            $('#step2').show();
            connection.trigger('updateButton', {
                button: 'back',
                visible: true
            });
            connection.trigger('updateButton', {
                button: 'next',
                text: 'enregistrer',
                visible: true
            });
            break;
    }
}

function save() {
    let message = $('#message').val();

    payload['arguments'].execute.inArguments = [{
        "message": message,
        "emailAddress": "{{Contact.Attribute.CustomDE.EmailAddress}}"
    }];
    
    payload['metaData'].isConfigured = true;

    connection.trigger('updateActivity', payload);
}

function onGetTokens(tokens) {
    // Stockage des tokens si nécessaire
    console.log(tokens);
}

function onGetEndpoints(endpoints) {
    // Stockage des endpoints si nécessaire
    console.log(endpoints);
}

// Ajoutez des gestionnaires d'événements pour les boutons
$(document).ready(function() {
    $('#nextBtn').click(function() {
        $('#step1').hide();
        $('#step2').show();
    });
    
    $('#backBtn').click(function() {
        $('#step2').hide();
        $('#step1').show();
    });
    
    $('#saveBtn').click(function() {
        save();
    });
});