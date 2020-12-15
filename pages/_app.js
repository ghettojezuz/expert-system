import '../styles/reset.css'
import '../styles/globals.css'
import {Provider} from 'react-redux';
import {useStore} from '../store';
import PleaseSignin from "../components/PleaseSignIn";
import Head from "next/head";
import React from "react";
import Layout from "../components/Layout";

export default function MyApp({Component, pageProps}) {
    const store = useStore(pageProps.initialReduxState);

    return (
        <>
            <Head>
                <title>Expert System</title>
            </Head>
            <Provider store={store}>
                <PleaseSignin>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </PleaseSignin>
            </Provider>
        </>
    )
}