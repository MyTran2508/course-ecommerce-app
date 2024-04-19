
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { User } from '@/types/user.type';
import { Role } from "@/utils/resources";

// const userState: Pick<User, "username" | "photos" | "email" | "id" | "roles"> = {
//     username: "",
//     photos: "",
//     email: "",
//     id: "",
//     roles: null
// };

export interface UserState {
    user: Pick<User, "username" | "photos" | "email" | "id" | "roles">,
    updateUser: boolean
}

const userState: UserState = {
    user:  {
        username: "",
        photos: "",
        email: "",
        id: "",
        roles: null
    },
    updateUser: false
}


export const userSlice = createSlice({
    name: "user",
    initialState: userState,
    reducers: {
        setUser: (state, action: PayloadAction<Pick<User, "username" | "photos" | "email" | "id"| "roles">>) => {
            state.user = { ...state.user, ...action.payload };
        },
        removeUser: () => {
            return {...userState}
        },
        loadUser: (state) => {
            if (state.user.roles === null) {
              state.user = {
                ...state.user,
                roles: [
                    {
                        id: "ROLE_GUEST",
                        name: Role.GUEST
                    }
                ]
                };
            }
            return state
        },
        updateUser: (state) => {
            state.updateUser = !state.updateUser;
        }
        
    }
})

export const {setUser, removeUser, loadUser, updateUser } = userSlice.actions;

export default userSlice.reducer;