import {test} from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {once} from 'node:events';
test('password boundary, upload validation, conversation and logout',async()=>{
 let received;const mock=http.createServer(async(req,res)=>{let raw='';for await(const b of req)raw+=b;received=JSON.parse(raw);res.setHeader('Content-Type','application/json');res.end(JSON.stringify({message:{content:'Test explanation'}}));});mock.listen(0,'127.0.0.1');await once(mock,'listening');
 const child=spawn(process.execPath,['server.mjs'],{env:{...process.env,PORT:'3098',NODE_ENV:'test',CHAT_PASSWORD:'test-only-long-password',OLLAMA_API_KEY:'mock-only',OLLAMA_CHAT_URL:`http://127.0.0.1:${mock.address().port}`},stdio:['ignore','pipe','pipe']});
 try{await Promise.race([once(child.stdout,'data'),new Promise((_,reject)=>setTimeout(()=>reject(Error('Server startup timeout')),10000).unref())]);
 const base='http://127.0.0.1:3098';const headers={'X-Study-Request':'1','Content-Type':'application/json'};
 assert.equal((await fetch(base+'/api/chat',{method:'POST',headers,body:'{}'})).status,401);
 assert.equal((await fetch(base+'/api/login',{method:'POST',headers,body:JSON.stringify({password:'wrong'})})).status,401);
 assert.equal((await fetch(base+'/api/login',{method:'POST',headers:{...headers,Origin:'https://other.example'},body:'{}'})).status,403);
 let r=await fetch(base+'/api/login',{method:'POST',headers,body:JSON.stringify({password:'test-only-long-password'})});assert.equal(r.status,200);const cookie=r.headers.get('set-cookie').split(';')[0];assert.match(r.headers.get('set-cookie'),/HttpOnly/);
 const multipart={'X-Study-Request':'1',Cookie:cookie};const form=new FormData();form.append('message','Explain');form.append('files',new Blob(['study attachment']), 'notes.txt');
 r=await fetch(base+'/api/chat',{method:'POST',headers:multipart,body:form});assert.equal(r.status,200);assert.equal((await r.json()).answer,'Test explanation');assert.match(received.messages.at(-1).content,/study attachment/);
 const image=new FormData();image.append('message','Read diagram');image.append('files',new Blob([Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==','base64')]),'image.png');
 r=await fetch(base+'/api/chat',{method:'POST',headers:multipart,body:image});assert.equal(r.status,200);assert.equal(received.messages.at(-1).images.length,1);assert.equal(received.messages.length,4);
 const bad=new FormData();bad.append('message','Read');bad.append('files',new Blob(['not a png']),'bad.png');r=await fetch(base+'/api/chat',{method:'POST',headers:multipart,body:bad});assert.equal(r.status,400);
 r=await fetch(base+'/api/reset',{method:'POST',headers:{...headers,Cookie:cookie},body:'{}'});assert.equal(r.status,200);
 r=await fetch(base+'/api/logout',{method:'POST',headers:{...headers,Cookie:cookie},body:'{}'});assert.equal(r.status,200);
 assert.equal((await fetch(base+'/api/chat',{method:'POST',headers:{...headers,Cookie:cookie},body:'{}'})).status,401);
 }finally{child.kill();mock.close();}
});
