<template>

  <div
    v-if="running"
    class="chat absolute bottom-0 left-0 w-1/3 h-full text-left"
  >
    <div class="messageboard absolute bottom-12 left-0 pl-6 mb-3 w-full" ref="messageboard">
      <transition-group name="list">
        <div v-for="msg in messages_to_show" :key="msg.id" class="message pt-1" :class="{ is_status: msg.is_status }">
          <div v-if="msg.is_status" class="">
              <i>{{ msg.username }} {{ msg.msg }} </i>
          </div>
          <div v-else-if="user.name == msg.username">
            <div class="username text-left inline" :style="{ color: 'white' } ">
              *ME*:
              <!--<span style="font-size:0.8em" v-if="getSources(msg).length > 0">(<span v-for="(source,i) in getSources(msg)">#{{ source.id }}<span v-if="i != getSources(msg).length - 1">,</span></span>)</span>:-->
            </div>
            <div class="content text-left inline" v-html="msg.msg_html" :style="{ color: msg.srccolor }"></div>
          </div>
          <div v-else>
            <div class="username inline text-left" :style="{ color: msg.srccolor }">
              {{ msg.username }}:
              <!--<span class="text-xs" v-if="getSources(msg).length > 0">(<span v-for="(source,i) in getSources(msg)">#{{ source.id }}<span v-if="i != getSources(msg).length - 1">,</span></span>)</span>:-->
            </div>
            <div class="content inline text-left" :style="{ color: msg.srccolor }" v-html="msg.msg_html"></div>
          </div>
        </div>
      </transition-group >
      <div class="messageboard_anchor"></div>
    </div>
  </div>
  <div
    v-if="running"
    class="messagecompose absolute bottom-2 left-0 w-full md:w-1/3 pl-3 text-left"
  >
    <input
      type="text"
      v-model='msg'
      placeholder="type message here  "
      class="w-4/6 m-2 p-2 pl-1 border-gray-500 border-b-2 bg-transparent text-left text-white focus:outline-none"
      @keyup.enter="sendMessage"
    />
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
      class="inline hover:cursor-pointer feather feather-send"
      @click="sendMessage"
    >
      <line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
    </svg>
  </div>
  <div v-if="running" class="chatbg absolute top-0 left-0 pl-5 h-10 bg-black text-left">
    &nbsp;
  </div>

  <div class="footer p-1">
<pre>
┏━━━┓━┓┏━┓━━━┓━━━┓
┃┏━┓┃┃┗┛┃┃┏━┓┃┏━┓┃
┃┃┃┃┃┏┓┏┓┃┗━┛┃┃┃┃┃
┃┗━┛┃┃┃┃┃┃┏┓┏┛┃┃┃┃
┃┏━┓┃┃┃┃┃┃┃┃┗┓┗━┛┃
┗┛┃┗┛┛┗┛┗┛┛┗━┛━━━┛
┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃
┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃┃
</pre>
  </div>

  <div class="absolute top-0 left-0 h-full w-full text-center">
    <svg
      ref="diagram"
      class="mx-auto h-full w-full"
      @mousemove="dragUser"
      @mouseleave="dragUserStop"
      @mouseup="dragUserStop"
    >
      <g>
        <g class="streams">0
          <g v-for="(stream, i) in streams">
            <defs>
              <radialGradient :id="'grad'+i" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" :style="'stop-color: ' + stream.color +'; stop-opacity: 0.7'" />
                <!--<stop offset="0%" :style="'stop-color: rgb(150, 150, 150); stop-opacity: 0.6'" />-->
                <stop offset="100%" :style="'stop-color: ' + stream.color +'; stop-opacity: 0.1'" />
              </radialGradient>
            </defs>
            <circle
              class="spread"
              :cx='x_offset + width/2 + radius * stream.x'
              :cy='y_offset + height/2 + radius * stream.y'
              :r="source_radius"
              :fill="'url(#grad'+i+')'"
              :style="(tunedin == i ? 'stroke:white' : '')"
            />
            <circle
              class='source'
              :cx='x_offset + width/2 + radius * stream.x'
              :cy='y_offset + height/2 + radius * stream.y'
              :r="4"
              :style="'stroke:'+ stream.color"
            />
            <circle
              class='tunein'
              :class="{ active: tunedin == i }"
              :cx='x_offset + width/2 + radius * stream.x'
              :cy='y_offset + height/2 + radius * stream.y'
              :r="source_radius * tunein_fact"
            />
            <circle
              class='vm'
              :cx='x_offset + width/2 + radius * stream.x'
              :cy='y_offset + height/2 + radius * stream.y'
              :r="stream.rms * source_radius"
            />
            <text
              :x='x_offset + width/2 + radius * stream.x - 25'
              :y='y_offset + height/2 + radius * stream.y - 15'
              :style="'fill:' + (tunedin == i ? 'white' : '#aaa')"
            >
              {{ stream.title }}
            </text>
          </g>
        </g>
      </g>
    </svg>
  </div>

  <transition-group name="slow-fade">
    <div
      v-for="msg in message_bubbles"
      :key="msg.id"
      :style="{
        position: 'absolute',
        color: 'black',
        left: (x_offset + width/2 + msg.x * this.radius) + 'px',
        bottom: (-y_offset + height/2 - msg.y * this.radius + (msg.user_id === user.id ? 18 : 12)) + 'px',
        padding: '3px',
        background: 'rgba(255, 255, 255, 0.7)',
        borderRadius: '2px',
        maxWidth: '200px',
        transform: 'translate(-50%, 0)'
      }"
      v-html="msg.msg_html"
    >
    </div>
  </transition-group>

  <div class="absolute top-0 left-0 h-full w-full text-center">
    <svg
      ref="diagram"
      class="mx-auto h-full w-full"
      @mousemove="dragUser"
      @mouseleave="dragUserStop"
      @mouseup="dragUserStop"
    >
      <defs>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
        </filter>
      </defs>
      <g>

        <g v-for="user in audience" class="audience">
          <circle
            :key="user.id"
            :cx="x_offset + width/2 + user.x * radius"
            :cy="y_offset + height/2 + user.y * radius"
            :r='6'
          />
          <text
            :x="x_offset + width/2 + user.x * radius + 2"
            :y="y_offset + height/2 + user.y  * radius - 20"
          >
            {{ user.name }}
          </text>
        </g>

        <circle
          class='avatar'
          :cx="x_offset + width/2 + user.x * radius"
          :cy="y_offset + height/2 + user.y * radius"
          :r='10'
          @mousedown="dragUserStart"
          @mouseup="dragUserStop"
          @mousemove="dragUser"
        />
      </g>
    </svg>
  </div>

  <transition name="fade">
    <div v-if="!running">
      <div class="bg">
        &nbsp;
      </div>
      <div class="info" :style="'top:'+ this.y_offset + 'px;'">
        <div class='w-full'>
          <br><br>
          you are here<br>
          <br>
          (drag me around to change position)<br>
          <svg xmlns="http://www.w3.org/2000/svg" style="width:100px; height:100px; display: inline-block" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
          <br><br>
          <br><br>
          but first give me your name:<br>
          <br>
          <input
            type="text"
            v-model='user.name'
            placeholder="anonym"
            class="m-3 p-2 border-white border-b-2 bg-transparent text-center focus:outline-none"
            @keyup.enter="login"
          />
            <br>
          <button
            type="button"
            name="button"
            @click="login"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
          </button>
          <br><br>
          (headphones recommended)
        </div>
      </div>
    </div>
  </transition>

  <template v-if="!loaded">
    <div class="bg" style="background: black">
      &nbsp;
    </div>
    <div class="info">
      loading config..
    </div>
  </template>

  <transition name="fade">
    <div
      v-if="about"
      class="about p-10 absolute top-0 left-0 w-full h-full flex items-center justify-center text-left"

    >
      <div @click="about = false" class="absolute top-3 right-3 hover:text-white hover:cursor-pointer">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div class="pb-20 text-xs md:text-xl max-w-prose">
        <h1 class="text-xl md:text-3xl my-4 md:my-10">a.space by servus.at</h1>
        <p class="mb-4">a.space is a distributed sound installation that
          interconnects events, through a directional loop affected by space,
          feedback and the audience. The set is activated on-site by
           Stefan Tiefengraber in Linz, Polina Khatsenka in Ústí nad Labem,
           Luka Prinčič and ala pecula in Ljubljana. Through a virtual
           platform it is possible to listen, choose a point of perspective and
           interact with others. The project explores the heterogeneity of time
           and space, in search of points of communication and synchronicity.
        </p>
        <p class="mb-4">It is conceptualized by Davide Bevilaqua and Gabriela Gordillo.
           Realized by <a href="https://servus.at">servus.at</a> with the support of Linz_Sounds 2021,
           in collaboration with bb15, Emanat Institute, Ústí nad Labem House of Arts.
            Web Interface developed by <a href="https://m.ash.to">Michael Aschauer</a>.
        </p>
        <p class="mb-4">June 16th - from (15:00 to 19:00) in the frame of
          AMRO22, accessible online at <a href="https://a-space.servus.at">a-space.servus.at</a>
        </p>
      </div>

    </div>
  </transition>

  <div class="title absolute top-0 left-0 pl-5 h-10 text-left">
    a.space <a class="text-xs" href="#" @click="about = true">about</a>
  </div>



</template>

<script>

import io from 'socket.io-client';
import { ResonanceAudio } from 'resonance-audio'
import { SendIcon } from 'vue-feather-icons'
import { Autolinker } from  'autolinker'
import { forceSimulation }  from 'd3-force';
import { forceManyBody }  from 'd3-force';
import { forceCollide }  from 'd3-force';
import { forceRadial }  from 'd3-force';
import chroma from "chroma-js"
//import randomColor from 'randomcolor'
//import Autolinker from 'autolinker';
//import CustomScrollbar from 'custom-vue-scrollbar';
//import 'custom-vue-scrollbar/dist/style.css';

export default {

  components: {
    SendIcon,
    // CustomScrollbar,
  },

  data () {
    return {
      loaded: false,
      running: false,
      dragging: false,
      tunedin: -1,
      width: 0,
      height: 0,
      scale: 1,
      x_offset: 0,
      y_offset: 0,
      drawId: undefined,
      source_radius: 50,
      source_dist_fact: 0.55,
      tunein_fact: 0.25,
      streams: [],
      msg: '',
      user: {
        name: '',
        x: 0.0,
        y: 0.0
      },
      audience: {},
      messages: [],
      message_bubbles: [],
      messages_to_show: [],
      about:false
    }
  },

  mounted () {
    fetch("/streams.json")
      .then((response) => response.json())
      .then((config) => {
         this.streams = config.streams;
         this.loaded = true
         this.onResize()
         this.calculateSourcePositions()
         // this.setupAudio()
      })

    window.addEventListener("resize", this.onResize)
    // window.addEventListener("mousedown", this.start)

  },

  destroyed () {
     window.removeEventListener("resize", this.onResize)
     // window.removeEventListener("mousedown", this.start)
     window.cancelAnimationFrame(this.drawID);
  },

  methods: {
    start () {
      console.log('start');
      if (!this.running) {
        this.setupAudio()
      }
    },

    login() {
      let self = this

      if (this.user.name == '') {
        this.user.name = 'anonym'
      }
      this.start()
      this.socket = io.connect({ path: "/ws" })
      this.socket.on('your-id', (data) => {
        self.user.id = data.id
      })

      this.socket.on('message', (msg_data) => {
        msg_data.msg_html = Autolinker.link(msg_data.msg)
        msg_data.srccolor = this.msgcolor(msg_data)
        self.messages.push(msg_data)
        self.message_bubbles.push(msg_data)
        if (self.sameRoom(msg_data, self.user)) {
          self.messages_to_show.push(msg_data)
        }
        /*
        window.setTimeout(function() {
          self.$refs.messageboard.scrollTop = self.$refs.messageboard.scrollHeight;
        }, 200);
        */
        window.setTimeout( function() {
          self.message_bubbles.shift(msg_data)
        }, 2000);
      })

      this.socket.on('moved', (user_data) => {
        self.audience[user_data.id] =  user_data
        this.reArrangeAudience(user_data)
      })

      this.socket.on('history', (data) => {
        self.audience = data.users
        self.messages = data.messages
        self.messages.forEach((item, i) => {
          item.msg_html = Autolinker.link(item.msg)
          item.srccolor = this.msgcolor(item)
        });
        self.messages_to_show = self.messages.filter(msg => self.sameRoom(msg, self.user))

        window.setTimeout( function() {
            self.$refs.messageboard.scrollTop = self.$refs.messageboard.scrollHeight;
        }, 200);
        if (self.audience) {
          Object.keys(self.audience).forEach((key) => {
            self.reArrangeAudience(self.audience[key])
          });
        }
      })

      this.socket.on('joined', (data) => {
        self.audience[data.id] = data
        let msg_data = {
          username: data.name,
          msg: "joined",
          is_status: true,
          x: 0,
          y: 0
        }
        self.messages.push(msg_data)
        self.messages_to_show.push(msg_data)
      })

      this.socket.on('left', (user_data) => {
        delete this.audience[user_data.id]
        self.deleteFromAudience(user_data)
        let msg_data = {
          username: user_data.name,
          msg: "left",
          is_status: true,
          x: 0,
          y: 0
        }
        self.messages.push(msg_data)
        self.messages_to_show.push(msg_data)
      })

      this.socket.emit('join', this.user);
      this.messages_to_show = this.messages.filter(msg => this.sameRoom(msg, this.user))
      if (this.$refs.messageboard) {
        this.$refs.messageboard.scrollTop = this.$refs.messageboard.scrollHeight;
      }
      this.$forceUpdate()
    },

    sendMessage() {
      if (this.msg.length > 0) {
        this.socket.emit('message',{
          msg: this.msg,
          username: this.user.name,
          x: this.user.x,
          y: this.user.y
        })
        this.msg = ''
      }
    },

    setupAudio() {
      let self = this
      console.log('setup resonance audio');
      this.audioContext = new AudioContext()
      this.resonanceAudioScene = new ResonanceAudio(this.audioContext)
      this.resonanceAudioScene.output.connect(this.audioContext.destination)

      const roomDimensions = {
        width: 2,
        height: 2,
        depth: 2,
      };
      const roomMaterials = {
        left: 'transparent',
        right: 'transparent',
        front: 'transparent',
        back: 'transparent',
        down: 'transparent',
        up: 'transparent',
      }
      this.resonanceAudioScene.setRoomProperties(roomDimensions, roomMaterials);

      this.streams.forEach((stream, i) => {
        stream.source = this.resonanceAudioScene.createSource()
        stream.source.setPosition(stream.x, 0, stream.y);
        stream.source.setGain(1)
        stream.source.setMinDistance(0.01)
        stream.source.setMaxDistance(this.source_dist_fact);
        stream.source.setRolloff('linear')

        stream.audioElement = document.createElement('audio');
        stream.audioElement.src = stream.src + '?t=' + Date.now();
        // stream.audioElement = document.getElementById('stream' + i)
        stream.audioElement.crossOrigin = 'Anonymous'
        stream.audioElementSource = this.audioContext.createMediaElementSource(stream.audioElement)
        stream.audioElementSource.connect(stream.source.input)
        stream.rms = 0.0

        /*
        stream.script = audioContext.createScriptProcessor(1024, 1, 1);
        stream.script.onaudioprocess = function(event) {
          const input = event.inputBuffer.getChannelData(0);
          let i;var dataArray = new Uint8Array(bufferLength);
          let sum = 0.0;
          for (i = 0; i < input.length; ++i) {
            sum += input[i] * input[i];
          }
          stream.rms = Math.sqrt(sum / input.length);
           //  that.slow = 0.95 * that.slow + 0.05 * that.instant;
           // console.log(stream.instant)

        };
        stream.audioElementSource.connect(stream.script)
        */

        stream.audioElement.play();
        if (!stream.audioElement.paused && !this.running) {
          this.running = true
        }

        stream.analyser = this.audioContext.createAnalyser();
        stream.analyser.fftSize = 1024;
        stream.analyser.minDecibels = -90;
        stream.analyser.maxDecibels = -10;
        stream.analyser.smoothingTimeConstant = 0.85;
        stream.bufferLength = stream.analyser.frequencyBinCount;
        stream.dataArray = new Uint8Array(stream.bufferLength);
        //stream.freqArray = new Uint8Array(stream.bufferLength);
        stream.analyser.getByteTimeDomainData(stream.dataArray);
        stream.audioElementSource.connect(stream.analyser)

        stream.nodes = []

        stream.force = forceSimulation()
          //.force("charge", forceManyBody())
          .force('collision', forceCollide().radius(0.02)) //10))
          .force('r', forceRadial()
            .radius(0.075) //self.source_radius / 10)
            .x(stream.x)
            .y(stream.y)
            //.x(self.widht/2 + stream.x * self.radius)
            //.y(self.height/2 + stream.y * self.radius)
          )
          .on('tick', function() {
            if (stream.nodes.length) {
              stream.nodes.forEach( (i) => {
                //console.log(i.id, i.x, i.y, i.vx, i.vy)
                //self.audience[i.id].x = self.width/2 + i.x * self.radius
                //self.audience[i.id].y = self.height/2 + node.y * self.radius
                if (self.audience[i.id]) {
                  self.audience[i.id].x = i.x
                  self.audience[i.id].y = i.y
                } else if (self.user.id == i.id) {
                  self.user.x = i.x
                  self.user.y = i.y
                }
              })
            }
          })
        //.nodes(stream.nodes)



      })
      this.resonanceAudioScene.setListenerPosition(this.user.x, 0, this.user.y);
      this.updateAnimation()
    },

    tuneIntoStream (id) {
      if (this.tunedin != id) {
        this.resonanceAudioScene.output.disconnect()
        this.streams[id].audioElementSource.connect(this.audioContext.destination)
        this.tunedin = id
      }
    },

    leaveStream (id) {
      if (this.tunedin == id ) {
        this.streams[id].audioElementSource.disconnect(this.audioContext.destination)
        this.resonanceAudioScene.output.connect(this.audioContext.destination)
        this.tunedin = -1
      }
    },

    calculateSourcePositions () {
      this.streams.forEach((stream, i) => {
        stream.x = 0.5 * Math.cos((i * 360 - 45)/this.streams.length * 0.0174532925)
        stream.y = 0.5 * Math.sin((i * 360 - 45)/this.streams.length * 0.0174532925)
      })
    },

    dragUser (e) {
      if (this.dragging) {
        this.user.x = (e.clientX - this.x_offset - this.width/2) / this.radius
        this.user.y = (e.clientY - this.y_offset - this.height/2) / this.radius
        this.resonanceAudioScene.setListenerPosition(this.user.x, 0, this.user.y);
        // this.socket.emit('moved', this.user);
        this.streams.forEach((stream, i) => {
          //console.log(i, this.distance(stream, this.user), this.tunein_fact * this.source_dist_fact)
          if (this.distance(stream, this.user) < (this.tunein_fact * this.source_dist_fact) ) {
            if (this.tunedin != i) {
              this.dragUserStop()
              console.log('tune into stream', i);
              this.tuneIntoStream(i)
            }
          } else {
            if (this.tunedin == i && this.tunedin > -1) {
              console.log('leave stream', i);
              this.leaveStream(i)
            }
          }
        })
        this.messages_to_show = this.messages.filter(msg => this.sameRoom(msg, this.user))
        this.$refs.messageboard.scrollTop = this.$refs.messageboard.scrollHeight;
        this.reArrangeAudience(this.user)
      }
    },

    dragUserStart () {
      this.dragging = true
    },

    dragUserUp (e) {
      if (this.dragging) {
        this.dragUserStop()
      } else {
        this.dragging = true
        this.dragUser(e);
        this.dragUserStop()
      }
    },

    dragUserStop () {
      if (this.dragging) {
        this.socket.emit('moved', this.user)
        this.dragging = false
        this.reArrangeAudience(this.user)
      }

    },

    onResize () {
      this.width = this.$refs.diagram.clientWidth // window.innerWidth; // el.clientWidth;
      this.height =this.$refs.diagram.clientHeight // window.innerHeight; // this.width * 9 / 16;
      if (this.height > this.width) {
          //this.width += this.width * 0.2
          this.x_offset =  -this.width * 0.2
          this.width = this.width - 2 * this.x_offset
          this.y_offset = -this.height * 0.1
          //this.width = this.width  - 2 * this.x_offset
          //this.y_offset =  -this.height * 0.2
      } else {
        this.x_offset = 0
        this.y_offset = -this.height * 0.05
      }
      this.radius = Math.min(this.height, this.width) / 2 * 1.3
      this.source_radius = Math.min(this.height, this.width) / 2 * this.source_dist_fact * 1.3
      this.$forceUpdate()
    },

    updateAnimation () {
      this.streams.forEach((stream, i) => {
        stream.analyser.getByteTimeDomainData(stream.dataArray);
        let sum = 0
        for(let i=0; i < stream.dataArray.length; i++) {
          sum +=  stream.dataArray[i]
        }
        const avg = sum / stream.dataArray.length
        stream.rms = Math.sqrt(Math.abs((sum / stream.dataArray.length) - 128) / 128)
      })
      this.drawID = requestAnimationFrame(this.updateAnimation)
    },

    distance (pos1, pos2) {
      return Math.sqrt((pos2.x - pos1.x)**2 + (pos2.y - pos1.y)**2)
    },

    sameRoom (item) {
      let result = false
      this.streams.forEach((stream, i) => {
        if (this.distance(stream, this.user) < this.source_dist_fact && this.distance(stream, item) < this.source_dist_fact) {
          result = true
        }
      })
      return result
    },

    getSources (item) {
      let result = []
      this.streams.forEach((stream, i) => {
        if (this.distance(stream, item) < this.source_dist_fact && this.distance(stream, item) < this.source_dist_fact) {
          result.push(stream)
        }
      })
      return result
    },

    msgbg(value) {
      let str = ''
      for (var i = 0; i < value.length ; i++) {
       str = str + '|'
      }
      return str
    },

    msgcolor (item) {
      if (
        this.streams[0].color === 'red' &&
        this.streams[1].color === 'green' &&
        this.streams[2].color === 'blue' &&
        false
      ) {
        let colors = this.streams.map(s => 255 - 255 * (Math.max(0, Math.min(1, this.distance(s, item)))))
        return 'rgba(' + colors.join(',') + ', 1)'
      } else {
        let colors = this.streams.map(s => s.color)
        let dists = this.streams.map(s => (1 - Math.max(0, Math.min(this.source_dist_fact, this.distance(s, item)) * 1.81)))
        //colors.push('white')
        //dists.push(0.1)
        return chroma.average(colors,'rgb', dists).brighten()
      }
    },

    deleteFromAudience (item) {
      this.streams.forEach((stream, i) => {
        if (stream.nodes.find( node => node.id == item.id )) {
          stream.nodes = stream.nodes.filter( node => node.id != item.id )
          stream.force.nodes(stream.nodes)
          stream.force.alpha(1).restart()
        }
      })
    },

    reArrangeAudience (item) {
      let self = this
      self.streams.forEach((stream, i) => {
        //console.log(i, this.distance(stream, this.user), this.tunein_fact * this.source_dist_fact)
        if (stream.nodes.find( node => node.id == item.id )) {
          if (self.distance(stream, item) < (this.tunein_fact * this.source_dist_fact) ) {
            stream.nodes = stream.nodes.filter( node => node.id != item.id )
            let node = {...item}
            // node.x = self.width/2 + node.x * self.radius
            // node.y = self.height/2 + node.y * self.radius
            stream.nodes.push(node)
            stream.force.nodes(stream.nodes)
            stream.force.alpha(1).restart()
          } else {
            stream.nodes = stream.nodes.filter( node => node.id != item.id )
            stream.force.nodes(stream.nodes)
            stream.force.alpha(1).restart()
          }
        } else {
          if (self.distance(stream, item) < (this.tunein_fact * this.source_dist_fact) ) {
            let node = {...item}
            // node.x = self.width/2 + node.x * self.radius
            // node.y = self.height/2 + node.y * self.radius
            stream.nodes.push(node)
            stream.force.nodes(stream.nodes)
            stream.force.alpha(1).restart()
          }
        }
      })
    }
  }
}

</script>

<style scoped>
a {
  /* color: #42b983; */
  text-decoration: underline
}
svg {
  margin:0;
  padding:0;
}

svg text {
  fill: green
}

.players { display: none }

.title {
  font-size: 1.5rem;
  z-index:1002;
}

.chatbg {
  width: 33%;
  font-size: 1.5rem;
  height: 20rem;
  background: linear-gradient(to bottom, rgba(0,0,0,1), rgba(0,0,0,0));
}

.footer {
  position: absolute; bottom: 10px; right: 10px;
  font-size: 1.2rem;
  color: green;
  filter: grayscale();
}

.bg {
  position: absolute; left: 0; top: 0; width:100%; height: 100%;
  background:rgba(0, 0, 0, 0.3);

}

.info {
  position: absolute;
  width: 100%; height: 100%;
  color:white;
  display: flex;
  align-items: center;
}

.loading-content {
  position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
  color:white;
}

.chat {

}

.about {
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  z-index:1001;
}

.messageboard {
  overflow-anchor: none;
  overflow-y: hidden;
  direction: rtl;
}
.messageboard div {
  direction: ltr;
}

.messageboard_anchor {
  overflow-anchor: auto;
  height: 1px;
}
.messagecompose {
  z-index:1000;
}


svg .avatar {
  cursor: pointer;
  stroke: white;
  stroke-width: 2;
  fill: white;
}

svg .audience circle {
  stroke: gray;
  stroke-width: 2;
  fill: gray;
}

svg .audience text {
  display: none;
  dominant-baseline: middle;
  text-anchor: middle;
  fill: white;
}

svg .audience:hover text {
  display: block
}

svg .bubbles text {
  fill: white;
  text-anchor: middle;
  dominant-baseline: middle;
}

svg .source {
  stroke: green;
  stroke-width: 4;
  fill: none
}

svg .tunein {
  stroke: rgba(255, 255, 255, 0.8);
  stroke-width: 0.5;
  stroke-dasharray: 7,7;
  fill: none;
}

svg .spread {
  stroke: rgba(150, 150, 150, 0.6);
  stroke-width: 1;
}

svg .vm {
  stroke: rgba(150, 150, 150, 0.7);
  stroke-width: 1.8;
  fill:none;
}

svg .active {
  color: white;
  stroke: white;
  stroke-width: 2;
}

svg text.active {
  color: white;
  fill: white;
  stroke-width: 0;
}


@media (max-width: 768px) {
  .footer { display: none}
}

@media (max-width: 1024px) {
  .messageboard { display: none}
}

</style>
