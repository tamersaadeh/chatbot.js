var client = require('../lib/client'),
	bot = require('../lib/bot'),
	task = require('../lib/task'),
	ltx = require('ltx'),
	sinon = require('sinon'),
	vows = require('vows'),
	assert = require('assert');

vows.describe('Client').addBatch({
	'online': {
		topic: function () {
			var topic = new client.Client({room: 'test', nick:'bot'}, {});
			topic.client = {
				messages: [],
				send: function (message) {
					this.messages.push(message);
				}
			}
			return topic;
		},
		'joins room with no history': function (topic) {
			topic.online();

			assert.equal(2, topic.client.messages.length);
			var message = topic.client.messages.pop();

			assert.equal('history', message.name);
			assert.equal(1, message.attrs.seconds);
			assert.equal('x', message.parent.name);

			message = topic.client.messages.pop();
			assert.equal('show', message.name);
			assert.equal('presence', message.parent.name);
		},
		'joins multiple rooms': function () {
			var topic = new client.Client({room:['test', 'test2'], nick: 'bot'});
			topic.client = {
				messages: [],
				send: function (message) {
					this.messages.push(message);
				}
			};
			topic.online();
			assert.equal(topic.client.messages.length, 3);

			var msg = topic.client.messages.pop();
			assert.equal('history', msg.name);
			assert.equal('test2/bot', msg.parent.parent.attrs.to);

			var msg = topic.client.messages.pop();
			assert.equal('history', msg.name);
			assert.equal('test/bot', msg.parent.parent.attrs.to);
		}
	},

	'read': {
		topic: function () {

			this.groupChat = "<message from='test@conference.jabber.company.com/Mark Story' to='mark@jabber.company.com/bot' type='groupchat' id='purple4ef0fdee'><body>hey</body></message>";

			this.nonGroupChat = "<message from='test@conference.jabber.company.com/Mark Story' to='mark@jabber.company.com/bot' type='direct' id='purple4ef0fdee'><body>hey</body></message>";

			this.selfMessage = "<message from='test/bot' to='test/bot' type='groupchat' id='purple4ef0fdee'><body>hey</body></message>";

			var botMock = {
				handleMessage: sinon.stub()
			};
			var clientStub = {
				send: sinon.stub()
			};

			var topic = new client.Client({room: 'test', nick:'bot'}, botMock);
			topic.client = clientStub;
			return topic;
		},

		'ignores messages not from groupchat': function (topic) {
			var stanza = ltx.parse(this.nonGroupChat);
			topic.read(stanza);
			assert.equal(false, topic.bot.handleMessage.called);
		},

		'ignore messages from self': function (topic) {
			var stanza = ltx.parse(this.selfMessage);
			topic.read(stanza);
			assert.equal(false, topic.bot.handleMessage.called);
		},

		'recieve messages': function (topic) {
			var stanza = ltx.parse(this.groupChat);
			topic.bot.handleMessage.returns('Winning');
			topic.read(stanza);
			assert.ok(topic.bot.handleMessage.called);
			assert.ok(topic.client.send.called);
		}
	},

	'send': {
		topic: function () {
			var clientStub = {
				send: sinon.spy()
			};

			var topic = new client.Client({room: 'test', nick:'bot'}, {});
			topic.client = clientStub;
			return topic;
		},

		'delivers text messages': function (topic) {
			topic.send('hello world');
			assert.ok(topic.client.send.called);
		},

		'delivers promises': function (topic) {
			var p = new task.Promise();
			topic.send(p);
			p.resolve('told you so');

			assert.ok(topic.client.send.called, 'Send was never called.');
		},
	},
	'sends messages to the right rooms': {
		topic: function () {
			var clientStub = {
				send: sinon.spy()
			};

			var topic = new client.Client({room: 'test', nick:'bot'}, {});
			topic.client = clientStub;
			return topic;
		},
		'works': function (topic) {
			topic.send('message', 'room/bot');

			assert.ok(topic.client.send.called);
			var call = topic.client.send.getCall(0);
			assert.equal('room/bot', call.args[0].parent.attrs.to);
		}
	}
}).export(module);
