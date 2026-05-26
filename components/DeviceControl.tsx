'use client';

import { useEffect, useRef, useState } from 'react';
import mqtt, { type MqttClient } from 'mqtt';
import type { Device } from '@/types';
import { getMetafieldValue } from '@/lib/cosmic';

interface LogEntry {
  timestamp: string;
  type: 'in' | 'out' | 'system';
  topic: string;
  message: string;
}

export default function DeviceControl({ device }: { device: Device }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [messages, setMessages] = useState<LogEntry[]>([]);
  const [publishMessage, setPublishMessage] = useState('');
  const clientRef = useRef<MqttClient | null>(null);
  const feedRef = useRef<HTMLDivElement>(null);

  const brokerUrl = getMetafieldValue(device.metadata?.mqtt_broker_url);
  const subTopic = getMetafieldValue(device.metadata?.subscribe_topic);
  const pubTopic = getMetafieldValue(device.metadata?.publish_topic);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = feedRef.current.scrollHeight;
    }
  }, [messages]);

  const log = (type: LogEntry['type'], topic: string, message: string) => {
    setMessages((prev) => [
      ...prev.slice(-99),
      { timestamp: new Date().toLocaleTimeString(), type, topic, message },
    ]);
  };

  const handleConnect = () => {
    if (!brokerUrl) {
      log('system', '', 'No MQTT broker URL configured');
      return;
    }

    setConnecting(true);
    log('system', '', `Connecting to ${brokerUrl}...`);

    try {
      const client = mqtt.connect(brokerUrl, {
        keepalive: 30,
        connectTimeout: 10000,
        clean: true,
      });

      client.on('connect', () => {
        setConnected(true);
        setConnecting(false);
        log('system', '', '✓ Connected to broker');

        if (subTopic) {
          client.subscribe(subTopic, (err) => {
            if (err) {
              log('system', '', `✗ Subscribe failed: ${err.message}`);
            } else {
              log('system', '', `✓ Subscribed to ${subTopic}`);
            }
          });
        }
      });

      client.on('message', (topic, payload) => {
        log('in', topic, payload.toString());
      });

      client.on('error', (err) => {
        log('system', '', `✗ Error: ${err.message}`);
        setConnecting(false);
      });

      client.on('close', () => {
        setConnected(false);
        log('system', '', 'Disconnected');
      });

      clientRef.current = client;
    } catch (err) {
      setConnecting(false);
      log('system', '', `✗ Connection failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const handleDisconnect = () => {
    if (clientRef.current) {
      clientRef.current.end(true);
      clientRef.current = null;
    }
    setConnected(false);
  };

  const handlePublish = () => {
    if (!clientRef.current || !connected || !pubTopic || !publishMessage) return;
    clientRef.current.publish(pubTopic, publishMessage);
    log('out', pubTopic, publishMessage);
    setPublishMessage('');
  };

  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.end(true);
      }
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-bold text-white mb-4">MQTT Connection</h2>
        <div className="space-y-3 mb-4">
          <div>
            <div className="text-xs text-slate-400 uppercase mb-1">Broker URL</div>
            <code className="text-sm text-brand-500 font-mono break-all">
              {brokerUrl || 'Not configured'}
            </code>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-slate-400 uppercase mb-1">Subscribe</div>
              <code className="text-sm text-green-400 font-mono break-all">
                {subTopic || '—'}
              </code>
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase mb-1">Publish</div>
              <code className="text-sm text-blue-400 font-mono break-all">
                {pubTopic || '—'}
              </code>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!connected ? (
            <button
              onClick={handleConnect}
              disabled={connecting || !brokerUrl}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              {connecting ? 'Connecting...' : 'Connect'}
            </button>
          ) : (
            <button
              onClick={handleDisconnect}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              Disconnect
            </button>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span
              className={`w-2 h-2 rounded-full ${
                connected ? 'bg-green-500 animate-pulse' : 'bg-slate-500'
              }`}
            ></span>
            <span className={connected ? 'text-green-400' : 'text-slate-400'}>
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>

        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded text-xs text-yellow-200">
          <strong>Note:</strong> Use a WebSocket MQTT broker URL (e.g., <code>wss://broker.example.com:8884/mqtt</code>). Standard <code>mqtt://</code> URLs do not work in browsers.
        </div>
      </div>

      {connected && pubTopic && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-bold text-white mb-3">Publish Message</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={publishMessage}
              onChange={(e) => setPublishMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePublish()}
              placeholder='e.g., {"command":"toggle"}'
              className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-brand-500"
            />
            <button
              onClick={handlePublish}
              disabled={!publishMessage}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
        <div className="px-6 py-3 border-b border-slate-700 flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Message Feed</h3>
          <button
            onClick={() => setMessages([])}
            className="text-xs text-slate-400 hover:text-white"
          >
            Clear
          </button>
        </div>
        <div
          ref={feedRef}
          className="h-80 overflow-y-auto p-4 font-mono text-sm scrollbar-thin"
        >
          {messages.length === 0 ? (
            <div className="text-slate-500 text-center py-12">
              No messages yet. Connect to start receiving data.
            </div>
          ) : (
            <div className="space-y-1">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-start gap-2 leading-relaxed">
                  <span className="text-slate-600 text-xs flex-shrink-0">
                    {msg.timestamp}
                  </span>
                  <span
                    className={`text-xs font-bold flex-shrink-0 ${
                      msg.type === 'in'
                        ? 'text-green-400'
                        : msg.type === 'out'
                        ? 'text-blue-400'
                        : 'text-yellow-400'
                    }`}
                  >
                    {msg.type === 'in' ? '◀ IN' : msg.type === 'out' ? '▶ OUT' : 'SYS'}
                  </span>
                  {msg.topic && (
                    <span className="text-purple-400 text-xs flex-shrink-0">
                      [{msg.topic}]
                    </span>
                  )}
                  <span className="text-slate-200 break-all">{msg.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}