import React from 'react';
import { useState, useEffect } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Button } from '@mui/material';
import { useQuery, gql, useMutation, useSubscription } from "@apollo/client";
import Form from './form';

const USERS = gql`
  query GetUsers {
    getUsers {
      id
      uname
      sname
      email
      contact
    }
  }
`;
const CREATE_USER = gql`
  mutation CreateUser($userInput: UserInput) {
    createUser(userInput: $userInput) {
      id
      uname
      sname
      email
      contact
    }
  }
`;
const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $userInput: UserInput) {
    updateUser(ID: $id, userInput: $userInput)
  }
`;
const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(ID: $id) 
  }
`;

const USER_CREATE_SUBSCRIPTION = gql`
  subscription UserCreated {
    userCreated {
      id
      uname
      sname
      email
      contact
    }
  }
`;
const USER_DELETION_SUBSCRIPTION = gql`
subscription Subscription {
  userDeleted
}
`;

const USER_UPDATE_SUBSCRIPTION = gql`
subscription Subscription {
  userUpdated {
    id
    uname
    sname
    email
    contact
  }
}
`;
const stl = {
  color: "white",
  fontSize: "16px",
  // fontWeight: "400"
}

export default function User() {
  const [addForm, setAddForm] = useState(false)
  const [editForm, setEditForm] = useState(false)
  const [prefill, setPrefill] = useState({})
  const { data, loading, error } = useQuery(USERS);
  // console.log(data)
  const [users, setUsers] = useState(data?.getUsers || []);
  const [createUser] = useMutation(CREATE_USER);
  const [updateUser] = useMutation(UPDATE_USER);
  const [deleteUser] = useMutation(DELETE_USER);

  const { data: subscriptionData } = useSubscription(USER_CREATE_SUBSCRIPTION, {
    onData: subscriptionData => {
      const newUser = subscriptionData.data.data.userCreated;
      setUsers(prevUsers => [...prevUsers, newUser]);
      // console.log(subscriptionData.data.data.userCreated)
    }
  });

  const { data: deletionData } = useSubscription(USER_DELETION_SUBSCRIPTION, {
    onData: deletionData => {
      // console.log(deletionData.data.data.userDeleted);
      const deletedUserId = deletionData.data.data.userDeleted;
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deletedUserId));
    }
  });
  const { data: updateData } = useSubscription(USER_UPDATE_SUBSCRIPTION, {
    onData: updateData => {
      // console.log("Update data Subscription", updateData.data.data.userUpdated)
      setUsers((prevUsers) => {
        const updatedUser = updateData.data.data.userUpdated;
        return prevUsers.map((user) => (user.id === updatedUser.id ? updatedUser : user));
      });
    }
  });
  async function createUserFun(data) {
    // console.log("From User", data)
    createUser({
      variables: {
        userInput: {
          uname: data.uname,
          sname: data.sname,
          email: data.email,
          contact: data.contact,
        },
      },
    });
    setAddForm(false);
  }
  async function editUserFun(data) {
    console.log(prefill)
    updateUser({
      variables: {
        id: prefill.id,
        userInput: {
          uname: data.uname,
          sname: data.sname,
          email: data.email,
          contact: data.contact
        },
      },
    });
    setEditForm(false)
  }
  async function deleteUserFunc(user_id) {
    await deleteUser({ variables: { id: user_id } });
  }
  function editData(user) {
    setEditForm(true);
    setPrefill(user);

  }
  useEffect(() => {
    if (data) {
      setUsers(data.getUsers);
    }
  }, [data]);

  if (loading) {
    return <h3 style={{ fontWeight: "400", width: "100%", textAlign: "center" }}>Loading...</h3>;
  }
  if (error) {
    console.error(error);
    return null;
  };
  return (
    <>
      {addForm ? <Form formModal={addForm} setFormModal={setAddForm} name={"Add User"} onData={createUserFun} /> : null}
      {editForm ? <Form prefill={prefill} formModal={editForm} setFormModal={setEditForm} name={"Edit User"} onData={editUserFun} /> : null}
      <Button sx={{ margin: 2 }} variant='contained' onClick={() => {
        setAddForm(true)
      }}>Add User</Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: '#276DBF' }}>
            <TableRow>
              <TableCell align="left" sx={stl}>Index</TableCell>
              <TableCell align="left" sx={stl}>Name</TableCell>
              <TableCell align="left" sx={stl}>Father Name</TableCell>
              <TableCell align="left" sx={stl}>Email</TableCell>
              <TableCell align="left" sx={stl}>Contact</TableCell>
              <TableCell align="center" sx={stl}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user, i) => (
              <TableRow
                key={i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ width: "30px" }}>
                  {i + 1}
                </TableCell>
                <TableCell component="th" scope="row">
                  {user.uname}
                </TableCell>
                <TableCell align="left">{user.sname}</TableCell>
                <TableCell align="left">{user.email}</TableCell>
                <TableCell align="left">{user.contact}</TableCell>
                <TableCell align="center">
                  <EditIcon sx={{ marginX: 1, color: "#276DBF" }} onClick={() => {
                    editData(user);
                    console.log("Edit Icon")
                  }} />
                  <DeleteIcon sx={{ marginX: 1, color: "#e01f1f" }} onClick={() => {
                    deleteUserFunc(user.id)
                    console.log('Delete', user.id)
                  }} />

                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
