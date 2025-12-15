import React from 'react'

const Auth = () => {
  const handleLogin= async()=>{
    try{
       await puter.auth.signIn();
    }catch(e){
        console.error("Login failed",e);
    }
  }
  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Welcome</h1>
          <h2>Login to continue Your Job Journey</h2>
          <button onClick={handleLogin}>Login</button>
        </div>
      </section>
    </main>
  )
}

export default Auth