const axios = require('axios');
const { AttachmentBuilder } = require('discord.js');
const querystring = require('node:querystring');
const crypto = require("node:crypto");
const WebSocket = require('ws');
const { token, ComfyServerAddress } = require('../config.json');

const client_id = crypto.randomUUID().toString();

let ongoingPrompts = [];


exports.queuePrompt = async (prompt) => {
  return axios({
    method: "post",
    url: `http://${ComfyServerAddress}/prompt`,
    data: prompt
  })
}

exports.getHistory = async () => {
  return axios({
    method: "get",
    url: `http://${ComfyServerAddress}/history`
  })
}

exports.getImage = async (filename, subfolder, folder_type) => {
  const resp = axios.get(`http://${ComfyServerAddress}/view?${querystring.stringify({ filename, subfolder, folder_type })}`,
    { responseType: 'arraybuffer' }
  );
  return resp
}

exports.gatherImages = async (ws, prompt, interaction) => {
  console.log('Beginning image creation step')
  const { data: { prompt_id } } = await this.queuePrompt(prompt);
  let queuedPrompt = true;
  let skipQueueCheck = false;
  ongoingPrompts.push(prompt_id);
  const onMessage = async (data) => {
    const parsed = JSON.parse(data);

    if (queuedPrompt && parsed?.data?.status?.exec_info?.queue_remaining === 1) {
      skipQueueCheck = true;
    } else if (skipQueueCheck) {
      console.log('Image has been created processing now')
      let { data: history } = await this.getHistory();
      for (const ongoingPrompt of ongoingPrompts) {
        const historyRecord = history[ongoingPrompt]
        let output_images = [];
        if (historyRecord) {
          ongoingPrompts = ongoingPrompts.filter(ongPrompt => ongPrompt === ongoingPrompt);
          for (o in historyRecord.outputs) {
            for (nodeId in historyRecord.outputs) {
              let node_output = historyRecord['outputs'][nodeId];
              if (node_output.images.length > 0) {
                for (const image of node_output['images']) {
                  const image_data = await this.getImage(image['filename'], image['subfolder'], image['type'])
                  const imageAttachment = new AttachmentBuilder(image_data.data)
                  output_images.push(imageAttachment)
                }
              }

            }
          }
          await interaction.followUp({ content: 'Here you go!', files: output_images })
        }
        if (ongoingPrompts.length === 0) {
          ws.removeListener('message', onMessage)
          ws.close();
        }
      }


    }
  }


  ws.on('message', onMessage)


}


exports.GenImage = async (prompt, interaction) => {
  const ws = new WebSocket(`ws://${ComfyServerAddress}/ws?clientId=${client_id}`);
  ws.on('close', (code) => {
    console.log('Closing ws', code)
  })
  console.log('gathering images')
  const res = await this.gatherImages(ws, prompt, interaction);

}
