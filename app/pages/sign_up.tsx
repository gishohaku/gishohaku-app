/** @jsx jsx */
import { useState } from 'react'
import Link from 'next/link'
import { jsx, css, Global } from '@emotion/core'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import SectionHeader from '../components/atoms/SectionHeader'
import { Container } from 'sancho'
import { withRouter } from 'next/router'
import { Button, InputGroup, Input, Divider, Text, useToast, Alert } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'
import { redirectAfterLogin } from './sign_in'

const loginData = {
  email: '',
  password: ''
}

const SignUp = ({ router }: any) => {
  const toast = useToast()
  const [error, setError] = useState('')

  return (
    <>
      <Global
        styles={{
          body: {
            backgroundColor: 'white'
          }
        }}
      />
      <Container
        style={{
          maxWidth: 380,
          paddingTop: 60
        }}
      >
        <SectionHeader text="SIGNUP">会員登録</SectionHeader>
        <Formik
          initialValues={loginData}
          onSubmit={(values, actions) => {
            const { email, password } = values
            const auth: firebase.auth.Auth = firebase.auth()
            auth
              .createUserWithEmailAndPassword(email, password)
              .then(() => {
                redirectAfterLogin(router)
                toast({
                  title: '会員登録が完了しました',
                  intent: 'success'
                })
              })
              .catch(error => {
                switch (error.code) {
                  case 'auth/invalid-email':
                    actions.setFieldError('email', '不正なメールアドレスです。')
                    break
                  case 'auth/email-already-in-use':
                    actions.setFieldError('email', '既に登録済みのアドレスです。')
                    break
                  case 'auth/weak-password':
                    actions.setFieldError('password', 'パスワードは6文字以上に設定してください')
                    break
                  default:
                    setError(
                      `エラーが発生しました。運営事務局までご連絡ください。: ${error.message}`
                    )
                  // 不明のエラー的な
                }
                console.log(error)
                actions.setSubmitting(false)
              })
          }}
          render={({ isSubmitting }) => {
            return (
              <Form>
                {error && <Alert intent="danger" title={error} />}
                {/* SSR時のfirst-child対応 */}
                <div />
                <InputGroup label="メールアドレス *">
                  <Field type="email" name="email" component={CustomInput} />
                </InputGroup>
                <InputGroup label="パスワード *" helpText="6文字以上で入力してください">
                  <Field type="password" name="password" component={CustomInput} />
                </InputGroup>
                <p
                  css={css`
                    font-size: 12px;
                    margin-top: 24px;
                    line-height: 1.5;
                  `}
                >
                  登録することで、
                  <Link href="/privacy" passHref>
                    <a>利用規約/プライバシーポリシー</a>
                  </Link>
                  に同意するものとします
                </p>
                <Button
                  intent="primary"
                  component="button"
                  loading={isSubmitting}
                  style={{
                    marginTop: 8,
                    width: '100%'
                  }}
                >
                  登録する
                </Button>
              </Form>
            )
          }}
        />
        <Divider />
        <Text variant="h6" muted>
          ソーシャルアカウントで登録・ログイン
        </Text>
        <Button
          component="button"
          onClick={async () => {
            await firebase.auth().signInWithPopup(new firebase.auth.GoogleAuthProvider())
            redirectAfterLogin(router)
            toast({
              title: 'ログインしました',
              intent: 'success'
            })
          }}
        >
          Google
        </Button>
        <Button
          component="button"
          onClick={async () => {
            await firebase.auth().signInWithPopup(new firebase.auth.GithubAuthProvider())
            redirectAfterLogin(router)
            toast({
              title: 'ログインしました',
              intent: 'success'
            })
          }}
        >
          GitHub
        </Button>
        <p
          css={css`
            font-size: 12px;
            margin-top: 2px;
            line-height: 1.5;
          `}
        >
          登録することで、
          <Link href="/privacy" passHref>
            <a>利用規約/プライバシーポリシー</a>
          </Link>
          に同意するものとします
        </p>
        <Divider />
        <Link href="/sign_in">
          <Button component="a" block variant="outline">
            すでに会員の方はこちら
          </Button>
        </Link>
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

export default withRouter(SignUp)
