const npc =   {
    "prompt":  {
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

const waifu = {
  "prompt":  {
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
                "text": "a sexy female __race__ wearing clothing that is __outfits__",
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

const husbaindu = {
  "prompt":  {
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
                "text": "a sexy male __race__ wearing clothing that is __outfits__",
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

module.exports = {
  npc,
  waifu,
  husbaindu
}