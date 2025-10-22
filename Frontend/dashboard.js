/* dashboard.js
  - interactive month/week toggle
  - tasks CRUD
  - agenda auto-refresh
  - notes per date
  - expects backend on http://localhost:8080
*/

const API_BASE = "http://localhost:8080";
const TASKS_API = API_BASE + "/api/tasks";
const token = localStorage.getItem("token");
if(!token) location.href = "login.html";

// UI refs
const taskListEl = document.getElementById("task-list");
const calendarGrid = document.getElementById("calendar-grid");
const agendaList = document.getElementById("agenda-list");
const notesArea = document.getElementById("notes-area");
const notesDate = document.getElementById("notes-date");
const modal = document.getElementById("task-modal");
const toastWrap = document.getElementById("toast-wrapper");
const loading = document.getElementById("loading-screen");

let allTasks = [];
let selectedDate = new Date().toISOString().slice(0,10);
let viewMode = "month"; // or "week"
let editingId = null;

// helpers
function showToast(msg, type="success"){
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  toastWrap.appendChild(t);
  setTimeout(()=>t.classList.add("show"),20);
  setTimeout(()=>{ t.classList.remove("show"); setTimeout(()=>t.remove(),300)}, 2500);
}
function setLoading(on){
  loading.classList.toggle("hidden", !on);
}

// fetch tasks
async function fetchTasks(){
  setLoading(true);
  try{
    const res = await fetch(TASKS_API, { headers:{ Authorization:`Bearer ${token}` }});
    if(!res.ok) throw new Error("Failed to load tasks");
    allTasks = await res.json();
  }catch(e){
    showToast(e.message,"error");
  } finally { setLoading(false); }
  renderAll();
}

// render tasks in left list for selectedDate
function renderTasks(){
  const dayTasks = allTasks.filter(t => t.date === selectedDate);
  taskListEl.innerHTML = "";
  if(dayTasks.length===0){
    taskListEl.innerHTML = "<div style='color:#7b6a5a'>No tasks for this day</div>"; return;
  }
  dayTasks.forEach(t=>{
    const li = document.createElement("li");
    li.className = "task-item";
    li.innerHTML = `
      <div class="task-left">
        <div class="bubble ${t.completed? 'done':''}" data-id="${t._id}">${t.completed? "✓":""}</div>
        <div>
          <div class="task-title">${escapeHtml(t.title)}</div>
          <div class="task-meta">${t.time||'No time'} • ${t.duration||0} min</div>
        </div>
      </div>
      <div class="task-actions">
        <button class="btn" data-action="edit" data-id="${t._id}">✏️</button>
        <button class="btn" data-action="delete" data-id="${t._id}">🗑️</button>
      </div>`;
    // bubble click toggle complete
    li.querySelector(".bubble").addEventListener("click", async (e)=>{
      const id = e.currentTarget.dataset.id;
      const task = allTasks.find(x=>x._id===id);
      if(!task) return;
      task.completed = !task.completed;
      await apiPut(`/api/tasks/${id}`, task);
      await fetchTasks();
    });
    li.querySelector('[data-action="edit"]').addEventListener("click", ()=> openModalFor(t));
    li.querySelector('[data-action="delete"]').addEventListener("click", ()=> deleteTask(t._id));
    taskListEl.appendChild(li);
  });
}

// calendar rendering (month / week)
function renderCalendar(){
  calendarGrid.innerHTML = "";
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  document.getElementById('month-label').textContent = today.toLocaleString('default',{month:'long', year:'numeric'});

  if(viewMode==="month"){
    // first day index
    const first = new Date(year, month, 1);
    const startOffset = first.getDay(); // 0..6
    // days count
    const daysInMonth = new Date(year, month+1, 0).getDate();
    // fill empties
    for(let i=0;i<startOffset;i++){
      const empty = document.createElement("div"); empty.className="cal-cell empty"; calendarGrid.appendChild(empty);
    }
    for(let d=1; d<=daysInMonth; d++){
      const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
      const cell = document.createElement("div"); cell.className="cal-cell"; cell.dataset.date=dateStr;
      if(dateStr===selectedDate) cell.classList.add("selected");
      const isToday = dateStr=== (new Date().toISOString().slice(0,10));
      if(isToday) cell.classList.add("today");
      const has = allTasks.some(t=>t.date===dateStr);
      cell.innerHTML = `<div class="daynum">${d}</div>`;
      if(has) cell.innerHTML += `<div class="taskdot"></div>`;
      cell.addEventListener("click", ()=> { selectedDate=dateStr; renderAll(); });
      calendarGrid.appendChild(cell);
    }
  } else {
    // week view centered on selectedDate
    const base = new Date(selectedDate);
    const start = new Date(base);
    start.setDate(base.getDate() - base.getDay()); // Sunday start
    for(let i=0;i<7;i++){
      const cur = new Date(start); cur.setDate(start.getDate()+i);
      const dateStr = cur.toISOString().slice(0,10);
      const cell = document.createElement("div"); cell.className="cal-cell"; cell.dataset.date=dateStr;
      if(dateStr===selectedDate) cell.classList.add("selected");
      if(dateStr=== (new Date().toISOString().slice(0,10))) cell.classList.add("today");
      cell.innerHTML=`<div class="daynum">${cur.toLocaleString('default',{weekday:'short'})} ${cur.getDate()}</div>`;
      if(allTasks.some(t=>t.date===dateStr)) cell.innerHTML += `<div class="taskdot"></div>`;
      cell.addEventListener("click", ()=>{ selectedDate=dateStr; renderAll();});
      calendarGrid.appendChild(cell);
    }
  }
}

// agenda: compact list for current week (Sun..Sat)
function renderAgenda(){
  agendaList.innerHTML = "";
  const base = new Date(selectedDate);
  const start = new Date(base); start.setDate(base.getDate() - base.getDay());
  for(let i=0;i<7;i++){
    const d = new Date(start); d.setDate(start.getDate()+i);
    const dateStr = d.toISOString().slice(0,10);
    const dayTasks = allTasks.filter(t => t.date===dateStr).sort((a,b)=> (a.time||'')>(b.time||'')?1:-1);
    const li = document.createElement("li"); li.className="agenda-item";
    const left = document.createElement("div");
    left.innerHTML = `<div style="font-weight:700">${d.toLocaleString('default',{weekday:'short'})} ${d.getDate()}</div>`;
    const right = document.createElement("div");
    right.style.minWidth="120px";
    if(dayTasks.length===0) right.innerHTML = `<div style="color:#7b6a5a">No tasks</div>`;
    else{
      right.innerHTML = dayTasks.map(t=> `<div><span class="time">${t.time||'—'}</span> ${escapeHtml(t.title)}</div>`).join("");
    }
    li.appendChild(left); li.appendChild(right);
    agendaList.appendChild(li);
  }
}

// open modal for add/edit
function openModalFor(task=null){
  document.getElementById('modal-title').textContent = task? 'Edit Task':'New Task';
  document.getElementById('title').value = task?.title || '';
  document.getElementById('desc').value = task?.desc || '';
  document.getElementById('date').value = task?.date || selectedDate;
  document.getElementById('time').value = task?.time || '';
  document.getElementById('duration').value = task?.duration || '';
  editingId = task?._id || null;
  modal.classList.remove('hidden');
}
function closeModal(){ modal.classList.add('hidden'); editingId=null; }

// save task (create or update)
async function saveTask(){
  const body = {
    title: document.getElementById('title').value.trim(),
    desc: document.getElementById('desc').value.trim(),
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    duration: document.getElementById('duration').value
  };
  if(!body.title || !body.date){ showToast('Please supply title & date','error'); return; }
  try{
    if(editingId){
      await apiPut(`/api/tasks/${editingId}`, body);
      showToast('Task updated');
    } else {
      await apiPost('/api/tasks', body);
      showToast('Task created');
    }
    closeModal();
    await fetchTasks();
  }catch(e){ showToast(e.message,'error'); }
}

// delete task
async function deleteTask(id){
  if(!confirm('Delete task?')) return;
  try{ await apiDelete(`/api/tasks/${id}`); showToast('Task deleted'); await fetchTasks(); }catch(e){ showToast(e.message,'error') }
}

// API helpers
async function apiGet(path){ const res = await fetch(API_BASE+path, { headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' } }); if(!res.ok) throw new Error(await res.text()); return res.json(); }
async function apiPost(path, body){ const res = await fetch(API_BASE+path, { method:'POST', headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify(body)}); if(!res.ok) throw new Error(await res.text()); return res.json(); }
async function apiPut(path, body){ const res = await fetch(API_BASE+path, { method:'PUT', headers:{ Authorization:`Bearer ${token}`, 'Content-Type':'application/json' }, body: JSON.stringify(body)}); if(!res.ok) throw new Error(await res.text()); return res.json(); }
async function apiDelete(path){ const res = await fetch(API_BASE+path, { method:'DELETE', headers:{ Authorization:`Bearer ${token}` } }); if(!res.ok) throw new Error(await res.text()); return res.json(); }

// utility escape
function escapeHtml(s){ if(!s) return ''; return s.replace(/[&<>"']/g, c=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c])); }

// notes
function loadNotes(){
  const key = 'notes-'+selectedDate;
  notesArea.value = localStorage.getItem(key) || '';
  document.getElementById('notes-date').textContent = selectedDate;
}
function saveNotes(){ localStorage.setItem('notes-'+selectedDate, notesArea.value); showToast('Notes saved'); }

// fetch all & initial render
async function fetchTasks(){
  setLoading(true);
  try{
    const res = await fetch(TASKS_API, { headers: { Authorization:`Bearer ${token}` }});
    if(!res.ok) throw new Error('Failed to fetch tasks');
    allTasks = await res.json();
    renderAll();
  }catch(e){ showToast(e.message,'error'); }
  setLoading(false);
}

// combined render
function renderAll(){
  renderCalendar();
  renderTasks();
  renderAgenda();
  loadNotes();
}

// toggles + events
document.getElementById('open-add').addEventListener('click', ()=> openModalFor());
document.getElementById('cancel-task').addEventListener('click', closeModal);
document.getElementById('save-task').addEventListener('click', saveTask);
document.getElementById('save-notes').addEventListener('click', saveNotes);
document.getElementById('refresh-btn').addEventListener('click', fetchTasks);
document.getElementById('toggle-view').addEventListener('click', ()=>{
  viewMode = (viewMode==='month')? 'week':'month';
  document.getElementById('toggle-view').textContent = viewMode==='month'? 'Week View':'Month View';
  renderCalendar();
});
document.getElementById('today-btn').addEventListener('click', ()=>{ selectedDate = new Date().toISOString().slice(0,10); renderAll(); });

// loading wrapper
function setLoading(on){ document.getElementById('loading-screen').classList.toggle('hidden', !on); }

// initial load
fetchTasks();
