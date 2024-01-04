const axios = require('axios');
const { sdKey  } = require('../config.json');
const { workflow } = require('../common/workflows/default.json');
const { Attachment, AttachmentBuilder } = require('discord.js');
const querystring = require('node:querystring');
const crypto = require("node:crypto");
const WebSocket = require('ws');

const baseUri = "https://stablediffusionapi.com/api/v3";
const serverAddr = "127.0.0.1:8188";
const client_id = crypto.randomUUID().toString();

exports.queuePrompt = async(prompt) => {
    return axios({
        method: "post",
        url: `http://${serverAddr}/prompt`,
        data: {
            "prompt": {
                "57": {
                  "inputs": {
                    "ckpt_name": "perfectdeliberate_v40.safetensors"
                  },
                  "class_type": "CheckpointLoaderSimple"
                },
                "58": {
                  "inputs": {
                    "seed": 829086049819405,
                    "steps": 30,
                    "cfg": 8,
                    "sampler_name": "euler",
                    "scheduler": "normal",
                    "denoise": 1,
                    "model": [
                      "57",
                      0
                    ],
                    "positive": [
                      "59",
                      0
                    ],
                    "negative": [
                      "60",
                      0
                    ],
                    "latent_image": [
                      "61",
                      0
                    ]
                  },
                  "class_type": "KSampler"
                },
                "59": {
                  "inputs": {
                    "text": "masterpiece best quality, girl, lovely evening dress, long black hair, solid white background",
                    "clip": [
                      "57",
                      1
                    ]
                  },
                  "class_type": "CLIPTextEncode"
                },
                "60": {
                  "inputs": {
                    "text": "extra limbs, watermark, ugly",
                    "clip": [
                      "57",
                      1
                    ]
                  },
                  "class_type": "CLIPTextEncode"
                },
                "61": {
                  "inputs": {
                    "width": 512,
                    "height": 512,
                    "batch_size": 1
                  },
                  "class_type": "EmptyLatentImage"
                },
                "62": {
                  "inputs": {
                    "samples": [
                      "58",
                      0
                    ],
                    "vae": [
                      "79",
                      0
                    ]
                  },
                  "class_type": "VAEDecode"
                },
                "77": {
                  "inputs": {
                    "filename_prefix": "chat-bot",
                    "images": [
                      "62",
                      0
                    ]
                  },
                  "class_type": "SaveImage"
                },
                "79": {
                  "inputs": {
                    "vae_name": "vae-ft-mse-840000-ema-pruned.safetensors"
                  },
                  "class_type": "VAELoader"
                }
              }
        }        
      })
}

exports.getHistory = async(prompt_id) => {
    return axios({
        method: "get",
        url: `http://${serverAddr}/history/${prompt_id}`
    })
}

exports.getImage = async(filename, subfolder, folder_type) => {
    console.log(`http://${serverAddr}/view?${querystring.stringify({filename, subfolder, folder_type})}`)
    const resp =  axios.get(`http://${serverAddr}/view?${querystring.stringify({filename, subfolder, folder_type})}`,
    {responseType: 'arraybuffer'}
    );
    return resp
}

exports.gatherImages = async(ws, prompt, interaction) => {
    console.log('Gather invoked')
    const {data: {prompt_id}} = await this.queuePrompt(prompt);
    let output_images = [];
    let inProgress = false;
    let runStarted = false;
    const onMessage = async (data) => {
        const parsed = JSON.parse(data);            
        if(parsed?.data?.sid) {
            console.log('Sid found');
            inProgress = true;
            runStarted = true;
        } else if(runStarted && inProgress && parsed?.data?.status?.exec_info?.queue_remaining === 0) {
            console.log('Getting history')
            let {data: history} = await this.getHistory(prompt_id);
            history = history[prompt_id]
            for(o in history.outputs) {
                for(nodeId in history.outputs) {
                    let node_output = history['outputs'][nodeId];
                    if (node_output.images.length > 0) {
                        for (const image of node_output['images']){
                            console.dir(image)
                            const image_data = await this.getImage(image['filename'], image['subfolder'], image['type'])
                            console.log('Type of data', typeof image_data.data)
                            const imageAttachment = new AttachmentBuilder(image_data.data)
                            output_images.push(imageAttachment)
                        }
                    }
                    
                }
            }
            await interaction.followUp({content: 'Here you go!', files: output_images})
            console.log('Finishing with images')
            ws.removeListener('message', onMessage)
            ws.close();
        }
    }


    ws.on('message', onMessage)    

   
}


exports.GenImage = async(prompt, interaction) => {
    const ws = new WebSocket(`ws://${serverAddr}/ws?clientId=${client_id}`);
    ws.on('close', (code) => {
        console.log('Closing ws', code)
    })
    console.log('gathering images')
    const res = await this.gatherImages(ws, prompt, interaction);

}
