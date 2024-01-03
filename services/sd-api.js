const axios = require('axios');
const { sdKey  } = require('../config.json');
const { workflow } = require('../common/workflows/default.json');
const querystring = require("node:querystring");
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
                "3": {
                    "class_type": "KSampler",
                    "inputs": {
                        "cfg": 8,
                        "denoise": 1,
                        "latent_image": [
                            "5",
                            0
                        ],
                        "model": [
                            "4",
                            0
                        ],
                        "negative": [
                            "7",
                            0
                        ],
                        "positive": [
                            "6",
                            0
                        ],
                        "sampler_name": "euler",
                        "scheduler": "normal",
                        "seed": Math.random() * 100000,
                        "steps": 40
                    }
                },
                "4": {
                    "class_type": "CheckpointLoaderSimple",
                    "inputs": {
                        "ckpt_name": "realcartoonRealistic_v8.safetensors"
                    }
                },
                "5": {
                    "class_type": "EmptyLatentImage",
                    "inputs": {
                        "batch_size": 1,
                        "height": 512,
                        "width": 512
                    }
                },
                "6": {
                    "class_type": "CLIPTextEncode",
                    "inputs": {
                        "clip": [
                            "4",
                            1
                        ],
                        "text": "masterpiece best quality girl, lovely evening dress"
                    }
                },
                "7": {
                    "class_type": "CLIPTextEncode",
                    "inputs": {
                        "clip": [
                            "4",
                            1
                        ],
                        "text": "bad hands"
                    }
                },
                "8": {
                    "class_type": "VAEDecode",
                    "inputs": {
                        "samples": [
                            "3",
                            0
                        ],
                        "vae": [
                            "4",
                            2
                        ]
                    }
                },
                "9": {
                    "class_type": "SaveImage",
                    "inputs": {
                        "filename_prefix": "ComfyUI",
                        "images": [
                            "8",
                            0
                        ]
                    }
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
    const query = querystring.stringify({filename, subfolder, folder_type})
    console.log(query);
    return axios({
        method: "get",
        url: `http://${serverAddr}/view${query}`
    })
}

exports.gatherImages = async(ws, prompt) => {
    const {data: {prompt_id}} = await this.queuePrompt(prompt);
    let output_images = {};
    let inProgress = false;
    let runStarted = false;
    ws.on('message', async (data) => {
        const parsed = JSON.parse(data);        
        if(parsed?.data?.sid) {
            inProgress = true;
            runStarted = true;
        } else if(runStarted && inProgress && parsed?.data?.status?.exec_info?.queue_remaining === 0) {
            let {data: history} = await this.getHistory(prompt_id);
            history = history[prompt_id]
            for(o in history.outputs) {
                for(nodeId in history.outputs) {
                    let node_output = history['outputs'][nodeId];
                    console.log(node_output)
                    if (node_output.length > 0) {
                        images_output = []
                        for (image in node_output['images']){
                            image_data = await this.getImage(image['filename'], image['subfolder'], image['type'])
                            console.dir(image_data)
                            images_output.append(image_data)
                        }
                        output_images[node_id] = images_output
                    }
                    
                }
            }
            return output_images
        }

       
    })    

   
}


exports.GenImage = async(prompt) => {
    const ws = new WebSocket(`ws://${serverAddr}/ws?clientId=${client_id}`);
   
    return this.gatherImages(ws, prompt);

}
