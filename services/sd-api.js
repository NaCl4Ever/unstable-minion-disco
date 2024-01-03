const axios = require('axios');
const { sdKey  } = require('../config.json');
const baseUri = "https://stablediffusionapi.com/api/v3";


module.exports = {
    GenImage: async(prompt) => {

        const body = {
            "key": sdKey,
            "prompt": prompt,
            "negative_prompt": null,
            "width": "512",
            "height": "512",
            "samples": "1",
            "num_inference_steps": "20",
            "safety_checker": "no",
            "enhance_prompt": "yes",
            "seed": null,
            "guidance_scale": 7.5,
            "multi_lingual": "no",
            "panorama": "no",
            "self_attention": "no",
            "upscale": "no",
            "embeddings_model": null,
            "webhook": null,
            "track_id": null
          }
        
         return axios({
            method: "post",
            url: `${baseUri}/text2img`,
            data: body
          })
    
    }
}
