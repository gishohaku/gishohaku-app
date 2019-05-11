/** @jsx jsx */
import Link from 'next/link'
import { useState } from 'react'
import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import Layout from '../components/Layout'
import SectionHeader from '../components/atoms/SectionHeader'
import { Container } from 'sancho'
import { withRouter } from 'next/router'
import { Spinner, Button, InputGroup, Input, Divider, Text, Tabs, Tab, Alert, useToast } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'

const loginData = {
  email: '',
}

const ResetPassword = ({ book, router }: any) => {
  const toast = useToast()
  const [error, setError] = useState('')
  return (
    <Layout tab={router.query.tab}>
      <Container style={{
        maxWidth: 380,
        paddingTop: 60
      }}>
        <SectionHeader text="">パスワードの再設定</SectionHeader>
        <Formik initialValues={loginData} onSubmit={(values, actions) => {
          const { email } = values
          firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
              router.push('/')
              toast({
                title: 'パスワード再設定メールを送信しました',
                intent: 'success'
              })
            })
            .catch((error) => {
              switch(error.code) {
                case 'auth/invalid-email':
                  setError('不正なメールアドレスです。')
                  break;
                case 'auth/user-not-found':
                  setError('ユーザーが見つかりませんでした。')
                  break;
                default:
                  setError('エラーが発生しました。運営事務局までご連絡ください。')
              }
              console.log(error)
              actions.setSubmitting(false)
            });
        }} render={({ values, errors, handleSubmit, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
          return <Form>
            {error && <Alert intent="danger" title={error} />}
            {/* SSR時のfirst-child対応 */}
            <div/>
            <InputGroup label="メールアドレス *">
              <Field type="email" name="email" component={CustomInput} />
            </InputGroup>
            <Button intent="primary" component="button" style={{
              marginTop: 24,
              width: '100%'
            }}>メールを送信</Button>
          </Form>
        }} />
      </Container>
    </Layout>
  )
}

const CustomInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
    <div>
      <Input type="text" {...field} {...props} />
      {touched[field.name] &&
        errors[field.name] && <div className="error">{errors[field.name]}</div>}
    </div>
  )

export default withRouter(ResetPassword)
