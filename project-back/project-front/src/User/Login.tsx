import LoginForm from './LoginForm'

const Login = (props: { dialogLogin?: (s: boolean) => void }) => {
   return (
      <div id='containerLoginRegister'>
         <div className='boxRL'>
            <LoginForm dialogLogin={props.dialogLogin} />
         </div>
      </div>
   )
}

export default Login