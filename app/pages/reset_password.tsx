/** @jsx jsx */
import { useState } from 'react'
import { NextPage } from 'next'

import { jsx, css } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import SectionHeader from '../components/atoms/SectionHeader'
import { Container } from 'sancho'
import { withRouter, PublicRouterInstance } from 'next/router'
import { Button, InputGroup, Input, Alert, useToast } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'

const loginData = {
  email: ''
}

interface Props {
  router: PublicRouterInstance
}

const ResetPassword: NextPage<Props> = ({ router }) => {
  const toast = useToast()
  const [error, setError] = useState('')
  return (
    <>
      <Container
        style={{
          maxWidth: 380,
          paddingTop: 60
        }}
      >
        <SectionHeader text="">パスワードの再設定</SectionHeader>
        <Formik
          initialValues={loginData}
          onSubmit={(values, actions) => {
            const { email } = values
            firebase
              .auth()
              .sendPasswordResetEmail(email)
              .then(() => {
                router.push('/')
                toast({
                  title: 'パスワード再設定メールを送信しました',
                  intent: 'success'
                })
              })
              .catch(error => {
                switch (error.code) {
                  case 'auth/invalid-email':
                    setError('不正なメールアドレスです。')
                    break
                  case 'auth/user-not-found':
                    setError('ユーザーが見つかりませんでした。')
                    break
                  default:
                    setError('エラーが発生しました。運営事務局までご連絡ください。')
                }
                console.log(error)
                actions.setSubmitting(false)
              })
          }}
          render={() => {
            return (
              <Form>
                {error && <Alert intent="danger" title={error} />}
                {/* SSR時のfirst-child対応 */}
                <div />
                <InputGroup label="メールアドレス *">
                  <Field type="email" name="email" component={CustomInput} />
                </InputGroup>
                <Button
                  intent="primary"
                  component="button"
                  style={{
                    marginTop: 24,
                    width: '100%'
                  }}
                >
                  メールを送信
                </Button>
              </Form>
            )
          }}
        />
      </Container>
    </>
  )
}

const CustomInput = ({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}: FieldProps<any>) => (
  <div>
    <Input type="text" {...field} {...props} />
    {touched[field.name] && errors[field.name] && <div className="error">{errors[field.name]}</div>}
  </div>
)

export default withRouter(ResetPassword)
