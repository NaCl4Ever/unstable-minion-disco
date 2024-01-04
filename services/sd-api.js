const axios = require('axios');
const { workflow } = require('../common/workflows/default.json');
const { Attachment, AttachmentBuilder } = require('discord.js');
const querystring = require('node:querystring');
const crypto = require("node:crypto");
const WebSocket = require('ws');
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
                  "ckpt_name": "dreamshaperXL_turboDpmppSDE.safetensors"
                },
                "class_type": "CheckpointLoaderSimple"
              },
              "58": {
                "inputs": {
                  "seed": Math.random() * 19999,
                  "steps": 10,
                  "cfg": 3,
                  "sampler_name": "euler",
                  "scheduler": "normal",
                  "denoise": 1,
                  "model": [
                    "57",
                    0
                  ],
                  "positive": [
                    "84",
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
                  "width": 1024,
                  "height": 1024,
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
                    "57",
                    2
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
              },
              "82": {
                "inputs": {
                  "text": "a __demeanor__ __race__ wearing clothing that is __outfits__",
                  "seed": Math.random() * 19999,
                  "autorefresh": "Yes"
                },
                "class_type": "DPRandomGenerator"
              },
              "84": {
                "inputs": {
                  "text": [
                    "82",
                    0
                  ],
                  "clip": [
                    "57",
                    1
                  ]
                },
                "class_type": "CLIPTextEncode"
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
    const resp =  axios.get(`http://${serverAddr}/view?${querystring.stringify({filename, subfolder, folder_type})}`,
    {responseType: 'arraybuffer'}
    );
    return resp
}

exports.gatherImages = async(ws, prompt, interaction) => {
    console.log('Beginning image creation step')
    const {data: {prompt_id}} = await this.queuePrompt(prompt);    
    let queuedPrompt = true;
    let skipQueueCheck = false;
    const onMessage = async (data) => {
        const parsed = JSON.parse(data);
        let output_images = [];
        if(queuedPrompt && parsed?.data?.status?.exec_info?.queue_remaining === 1) {
          skipQueueCheck = true;
        } else if(skipQueueCheck && parsed?.data?.status?.exec_info?.queue_remaining === 0) {
            console.log('Image has been created processing now')
            let {data: history} = await this.getHistory(prompt_id);
            history = history[prompt_id]
            for(o in history.outputs) {
                for(nodeId in history.outputs) {
                    let node_output = history['outputs'][nodeId];
                    if (node_output.images.length > 0) {
                        for (const image of node_output['images']){
                          const image_data = await this.getImage(image['filename'], image['subfolder'], image['type'])
                          const imageAttachment = new AttachmentBuilder(image_data.data)
                          output_images.push(imageAttachment)
                        }
                    }
                    
                }
            }            
            await interaction.followUp({content: 'Here you go!', files: output_images})
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
