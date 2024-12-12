import { useState } from "react";
import Header from './Header'

const Login = () => {
  const [input, setInput] = useState({
    username: "",
    password: "",
  });

  const handleSubmitEvent = (e) => {
    e.preventDefault();
    if (input.username !== "" && input.password !== "") {
      //dispatch action from hooks
    }
    alert("please provide a valid input");
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
   
    <form className ="container mx-auto w-[360px] rounded-md border-4 border-purple-800  space-y-2 p-4" onSubmit={handleSubmitEvent}>
      <div className="form_control ">
        <label class ="block text-sm font-semibold" htmlFor="user-email">Email</label>
        <input class="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800 disabled:border-purple-300 disabled:bg-purple-50"
          type="email"
          id="user-email"
          name="email"
          placeholder="example@yahoo.com"
          aria-describedby="user-email"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-email" className="sr-only">
          Please enter a valid username. It must contain at least 6 characters.
        </div>  
      </div>
      <div className="form_control">
        <label class=" block text-sm font-semibold" htmlFor="password">Password</label>
        <input  class="block w-full rounded-md border-2 border-purple-400 p-2 focus:border-purple-800 disabled:border-purple-300 disabled:bg-purple-50"
          type="password"
          id="password"
          name="password"
          aria-describedby="user-password"
          aria-invalid="false"
          onChange={handleInput}
        />
        <div id="user-password" className="sr-only">
          your password should be more than 6 character
        </div>
      </div>
      <div class="space-x-2 flex flex-row justify-between">
      <button className="btn-submit  bg-purple-300 text-purple-800 rounded-md border-purple-800 px-2 border-2">LogIn</button>
      <button className="btn-submit  bg-purple-300 text-purple-800 rounded-md border-purple-800 px-2 border-2">Sign Up</button>
      </div>
      
    </form>
    </>
    
  );
};

export default Login;


