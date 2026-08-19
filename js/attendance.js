// js/attendance.js
import { supabase } from './supabaseClient.js';

const statusMsg = document.getElementById('status-msg');
const clockInBtn = document.getElementById('clock-in-btn');
const clockOutBtn = document.getElementById('clock-out-btn');
const errorMsg = document.getElementById('error-msg');
const attendanceList = document.getElementById('attendance-list');

let currentUserId = null;
let openEntryId = null; // today's entry with no check-out yet

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = 'index.html';
    return;
  }

  currentUserId = session.user.id;
  await checkTodayStatus();
  loadRecent();
}

async function checkTodayStatus() {
  const today = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .eq('worker_id', currentUserId)
    .eq('date', today)
    .is('check_out_time', null)
    .maybeSingle();

  if (error) {
    statusMsg.textContent = 'Could not check status.';
    return;
  }

  if (data) {
    openEntryId = data.id;
    statusMsg.textContent = 'Clocked in — not yet clocked out.';
    clockInBtn.disabled = true;
    clockOutBtn.disabled = false;
  } else {
    openEntryId = null;
    statusMsg.textContent = 'Not clocked in today.';
    clockInBtn.disabled = false;
    clockOutBtn.disabled = true;
  }
}

async function loadRecent() {
  const { data, error } = await supabase
    .from('attendance')
    .select('*')
    .order('date', { ascending: false })
    .limit(10);

  if (error) {
    attendanceList.textContent = 'Could not load attendance.';
    return;
  }

  if (data.length === 0) {
    attendanceList.textContent = 'No records yet.';
    return;
  }

  attendanceList.innerHTML = data.map(entry => `
    <div class="log-entry">
      <strong>${entry.date}</strong><br>
      In: ${entry.check_in_time ? new Date(entry.check_in_time).toLocaleTimeString() : '—'}
      &nbsp;|&nbsp;
      Out: ${entry.check_out_time ? new Date(entry.check_out_time).toLocaleTimeString() : 'still working'}
    </div>
  `).join('');
}

clockInBtn.addEventListener('click', async () => {
  errorMsg.textContent = '';
  const today = new Date().toISOString().split('T')[0];

  const { error } = await supabase.from('attendance').insert({
    date: today,
    worker_id: currentUserId,
    check_in_time: new Date().toISOString()
  });

  if (error) {
    errorMsg.textContent = error.message;
    return;
  }

  await checkTodayStatus();
  loadRecent();
});

clockOutBtn.addEventListener('click', async () => {
  errorMsg.textContent = '';

  const { error } = await supabase
    .from('attendance')
    .update({ check_out_time: new Date().toISOString() })
    .eq('id', openEntryId);

  if (error) {
    errorMsg.textContent = error.message;
    return;
  }

  await checkTodayStatus();
  loadRecent();
});

checkAuth();