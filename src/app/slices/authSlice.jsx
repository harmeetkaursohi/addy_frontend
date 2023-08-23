import { createAsyncThunk, createSlice} from '@reduxjs/toolkit'
// export const logindata=createAsyncThunk("login/logindata",async()=>{

// })
const loginSlice = createSlice({
    name: 'login',
    initialState:{
        loader:false,
        error:false,
        logindata:[],
        value:0,
        data:[]
    },
    reducers: {
      counter:(state,action)=>{
        const data1=[...state,action.payload]
        console.log(action.payload,"payload data")
        return state.data=data1
      }  
    },
    // extraReducers: (builder) => {
    //     builder.addCase(logindata, (state, action) => {
    //     //   return state + action.payload
    //     })
    //     builder.addCase(logindata, (state, action) => {
      
    //     })
    //   },
  })
  export const  { counter } = loginSlice.actions
export default loginSlice.reducer;