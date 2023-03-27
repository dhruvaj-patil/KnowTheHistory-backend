'use strict';
let AWS = require('aws-sdk');


// Create the parameters

exports.getMp3FromS3 = async (event) => {
    let data;
    // Retrieve the key of the audio file from the request body
    if (event['body'] && typeof event['body'] == "object") {
        data = event['body'];
    }
    else {
        data = JSON.parse(event['body']);
    }
    const audioKey = data.title + '_' + data.language +'.mp3'
    console.log("🚀 ~ file: getEventAudio.js:17 ~ exports.getMp3FromS3= ~ audioKey:", audioKey)

    // Create an S3 object and download the audio file
    const s3 = new AWS.S3();
    const s3Params = {
        Bucket: 'retrospect-demo',
        Key: audioKey,
    };

    let audioBuffer;
    try {
        const s3Response = await s3.getObject(s3Params).promise();
        audioBuffer = s3Response.Body;
    } catch (error) {
        return {
            statusCode: 404,
            body: `Failed to retrieve file: ${error}`,
        };
    }

    // Prepare the response to be sent through the API Gateway
    const response = {
        statusCode: 200,
        headers: {
            'Content-Type': 'audio/mpeg',
        },
        body: audioBuffer.toString('base64'),
        isBase64Encoded: true,
    };

    return response;
}
