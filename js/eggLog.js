// js/eggLog.js
import { supabase } from './supabaseClient.js';

const eggForm = document.getElementById('egg-form');
const errorMsg = document.getElementById('error-msg');
const logsList = document.getElementById('logs-list');

let currentUserId = null;

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  currentUserId = session.user.id;
  loadLogs();
}

async function loadLogs() {
  const { data, error } = await supabase
    .from('egg_logs')
    .select('*')
    .order('date', { ascending: false })
    .limit(10);

  if (error) {
    logsList.textContent = 'Could not load logs.';
    return;
  }

  if (data.length === 0) {
    logsList.textContent = 'No logs yet.';
    return;
  }

  logsList.innerHTML = data.map(log => `
    <div class="log-entry">
      <strong>${log.date}</strong> — ${log.egg_count} eggs
      ${log.broken_count > 0 ? `(${log.broken_count} broken)` : ''}
      ${log.notes ? `<br><em>${log.notes}</em>` : ''}
    </div>
  `).join('');
}

eggForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorMsg.textContent = '';

  const date = document.getElementById('date').value;
  const eggCount = parseInt(document.getElementById('egg-count').value);
  const brokenCount = parseInt(document.getElementById('broken-count').value) || 0;
  const notes = document.getElementById('notes').value;

  const { error } = await supabase.from('egg_logs').insert({
    date,
    egg_count: eggCount,
    broken_count: brokenCount,
    notes: notes || null,
    recorded_by: currentUserId
  });

  if (error) {
    errorMsg.textContent = error.message;
    return;
  }

  eggForm.reset();
  loadLogs();
});

checkAuth();