const AUTH_API = "http://localhost:8080/api/auth";

function showToast(msg, t='success'){ const el=document.createElement('div'); el.className='toast'; el.textContent=msg; document.body.appendChild(el); setTimeout(()=>el.classList.add('show'),20); setTimeout(()=>{ el.classList.remove('show'); setTimeout(()=>el.remove(),300) },2500); }

async function handleLogin(){
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value.trim();
  const msg = document.getElementById('login-msg');
  msg.textContent=''; try{
    const res = await fetch(AUTH_API+'/login',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password})});
    const data = await res.json();
    if(!res.ok) throw new Error(data.message||res.statusText);
    localStorage.setItem('token', data.token); localStorage.setItem('user', JSON.stringify(data.user));
    // clear:
    document.getElementById('login-email').value=''; document.getElementById('login-password').value='';
    showToast('Welcome back!');
    setTimeout(()=>location.href='index.html',600);
  }catch(e){ msg.textContent=e.message; showToast(e.message,'error') }
}

async function handleRegister(){
  const name=document.getElementById('reg-name').value.trim();
  const email=document.getElementById('reg-email').value.trim();
  const password=document.getElementById('reg-password').value.trim();
  const msg=document.getElementById('reg-msg'); msg.textContent='';
  try{
    const res = await fetch(AUTH_API+'/register',{ method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({name,email,password})});
    const data = await res.json();
    if(!res.ok) throw new Error(data.message||res.statusText);
    document.getElementById('reg-name').value=''; document.getElementById('reg-email').value=''; document.getElementById('reg-password').value='';
    showToast('Account created!');
    setTimeout(()=>location.href='login.html',900);
  }catch(e){ msg.textContent=e.message; showToast(e.message,'error') }
}

function logout(){ localStorage.removeItem('token'); localStorage.removeItem('user'); showToast('Logged out'); setTimeout(()=>location.href='login.html',600) }
