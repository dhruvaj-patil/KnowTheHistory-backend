'use strict';
let AWS = require('aws-sdk');


// Create the parameters

exports.saveTextToMp3 = async (event) => {
    console.log("🚀 ~ file: saveTextToMp3.js:8 ~ exports.saveTextToMp3= ~ event:", event['body'])
    let data = undefined;
    let polly = new AWS.Polly();
    console.log("🚀 ~ file: saveTextToMp3.js:11 ~ exports.saveTextToMp3= ~ polly:", polly)
    let s3 = new AWS.S3();
    console.log("🚀 ~ file: saveTextToMp3.js:12 ~ exports.saveTextToMp3= ~ s3:", s3)
    // const requestBody = JSON.parse(event.body);
    if (event['body'] && typeof event['body'] == "object") {
        data = event['body'];
    }
    else {
        data = JSON.parse(event['body']);
    }
    console.log("🚀 ~ file: saveTextToMp3.js:20 ~ exports.saveTextToMp3= ~ data:", data)
    const { text, language, title } = data;

    // Synthesize speech using Polly
    const params = {
        OutputFormat: 'mp3',
        Text: text,
        VoiceId: 'Joanna'
    };
    const { AudioStream } = await polly.synthesizeSpeech(params).promise();
    console.log("🚀 ~ file: saveTextToMp3.js:22 ~ exports.saveTextToMp3= ~ AudioStream:", AudioStream)

    // Save audio file to S3 bucket
    const s3Params = {
        Bucket: 'retrospect-demo',
        Key: title + '_' + language + '.mp3',
        Body: AudioStream
    };
    console.log("🚀 ~ file: saveTextToMp3.js:30 ~ exports.saveTextToMp3= ~ s3Params:", s3Params)
    await s3.upload(s3Params).promise();

    // Return 200 OK response
    return {
        statusCode: 200,
        body: 'Speech synthesized and saved to S3 bucket!'
    };

    //   -----------------

    // const pollyParams = {
    //     OutputFormat: "mp3",
    //     Text: text,
    //     VoiceId: "Kajal"
    // }

    // try {
    //     polly.synthesizeSpeech(pollyParams)
    //         .on("success", (response) => {
    //             console.log("🚀 ~ file: saveTextToMp3.js:22 ~ .on ~ response:", response)
    //             let data = response.data;
    //             console.log("🚀 ~ file: saveTextToMp3.js:24 ~ .on ~ data:", data)
    //             let audioStream = data.AudioStream;
    //             console.log("🚀 ~ file: saveTextToMp3.js:26 ~ .on ~ audioStream:", audioStream)
    //             let key = title + _ + language;
    //             let s3BucketName = 'retrospect-demo'

    //             let s3Params = {
    //                 Bucket: s3BucketName,
    //                 Key: key,
    //                 Body: audioStream
    //             }

    //             s3.putObject(s3Params)
    //                 .on("success", () => {
    //                     console.log("Object has been placed in s3")
    //                     return {
    //                         statusCode: 200,
    //                         body: JSON.stringify(
    //                             {
    //                                 message: 'Saved to s3',
    //                                 data: params,
    //                             },
    //                             null,
    //                             2
    //                         ),
    //                     };
    //                 })
    //         })
    // }
    // catch (err) {
    //     console.log("Error putting object", err);
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify(
    //             {
    //                 message: 'Failed to save to s3',
    //                 err: err,
    //             },
    //             null,
    //             2
    //         ),
    //     };
    // }

    // const params = {
    //     OutputFormat: "mp3",
    //     OutputS3BucketName: "retrospect-demo",
    //     Text: text,
    //     TextType: "text",
    //     VoiceId: "Kajal",
    //     //  title + _ + language,
    //     SampleRate: "22050",
    // };

    // try {
    //     await pollyClient.send(new StartSpeechSynthesisTaskCommand(params));
    //     console.log("Success, audio file added to " + params.OutputS3BucketName);
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify(
    //             {
    //                 message: 'Saved to s3',
    //                 data: params,
    //             },
    //             null,
    //             2
    //         ),
    //     };
    // } catch (err) {
    //     return {
    //         statusCode: 200,
    //         body: JSON.stringify(
    //             {
    //                 message: 'Failed to save to s3',
    //                 err: err,
    //             },
    //             null,
    //             2
    //         ),
    //     };
    //     console.log("Error putting object", err);
    // }



    // Use this code if you don't use the http event with the LAMBDA-PROXY integration
    // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
}
