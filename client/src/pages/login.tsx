import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { FormEvent, useState } from 'react';
import InputGroup from '../components/InputGroup';
import { useRouter } from 'next/router';
import { useAuthDispatch, useAuthState } from '../context/auth';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../querys/mutations/login';
import LoginComponent from '../pageComponents/LoginComponent';

export default function Login() {


  return (
    <div><LoginComponent /></div>
  );
}
