sap.ui.define([], function () {
  "use strict";

  var _client = null;
  var _connected = false;

  function loadSupabase() {
    return new Promise(function (resolve) {
      if (window.supabase) { return resolve(); }
      var s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";
      s.async = true;
      s.onload = resolve;
      document.head.appendChild(s);
    });
  }

  function init() {
    return loadSupabase().then(function () {
      var url = window.SUPABASE_URL;
      var anon = window.SUPABASE_ANON_KEY;
      if (window.supabase && url && anon) {
        _client = window.supabase.createClient(url, anon);
        _connected = true;
      } else {
        _client = null;
        _connected = false;
      }
      return _connected;
    });
  }

  function listSystems() {
    if (_client) {
      return _client.from('systems').select('*').then(function (res) {
        if (res.error) { throw res.error; }
        return res.data || [];
      });
    }
    return Promise.resolve([
      { id: 'open-manufacturing', name: 'OPEN Manufacturing', type: 'IIS', status: 'unknown' },
      { id: 'open-webapi', name: 'OPEN WebApi', type: 'Windows Service', status: 'unknown' },
      { id: 'open-servicehost', name: 'OPEN ServiceHost', type: 'Windows Service', status: 'unknown' },
      { id: 'open-webreports', name: 'OPEN WebReports', type: 'Windows Service', status: 'unknown' }
    ]);
  }

  function listLogs(limit) {
    if (_client) {
      return _client.from('logs').select('*').order('timestamp', { ascending: false }).limit(limit || 200).then(function (res) {
        if (res.error) { throw res.error; }
        return res.data || [];
      });
    }
    return Promise.resolve([]);
  }

  function sendCommand(systemId, command) {
    if (_client) {
      return _client.from('commands').insert({ system_id: systemId, command: command }).then(function (res) {
        if (res.error) { throw res.error; }
        return true;
      });
    }
    return Promise.reject(new Error('Supabase não configurado'));
  }

  return {
    init: init,
    isConnected: function () { return _connected; },
    listSystems: listSystems,
    listLogs: listLogs,
    sendCommand: sendCommand
  };
});
