/** @jsx jsx */
import Link from 'next/link'
import { useState } from 'react'
import { jsx, css, Global } from '@emotion/core'
import firebase from 'firebase/app'
import SectionHeader from '../components/gishohaku1/SectionHeader'
import { Container } from 'sancho'
import { withRouter, NextRouter } from 'next/router'
import { Button, InputGroup, Input, Divider, Text, Alert, useToast } from 'sancho'
import { Formik, Field, Form, FieldProps } from 'formik'
import { NextPage } from 'next'
import { WithRouterProps } from 'next/dist/client/with-router'
import { REDIRECT_TO_AFTER_LOGIN } from '../withUser'

const loginData = {
  email: '',
  password: ''
}

export const redirectAfterLogin = (router: NextRouter) => {
  const afterLoginPath = localStorage.getItem(REDIRECT_TO_AFTER_LOGIN)
  localStorage.removeItem(REDIRECT_TO_AFTER_LOGIN)
  router.push(afterLoginPath || '/')
}

const SignIn: NextPage<WithRouterProps> = ({ router }) => {
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
        <SectionHeader text="LOGIN">ログイン</SectionHeader>
        <Formik
          initialValues={loginData}
          onSubmit={(values, actions) => {
            const { email, password } = values
            firebase
              .auth()
              .signInWithEmailAndPassword(email, password)
              .then(() => {
                redirectAfterLogin(router)
                toast({
                  title: 'ログインしました',
                  intent: 'success'
                })
              })
              .catch((error: any) => {
                switch (error.code) {
                  case 'auth/wrong-password':
                  case 'auth/user-not-found':
                    setError('メールアドレスまたはパスワードが違います')
                    break
                  default:
                    setError(
                      `エラーが発生しました。運営事務局までご連絡ください。: ${error.message}`
                    )
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
                <InputGroup label="パスワード *">
                  <>
                    <Field type="password" name="password" component={CustomInput} />
                    <div
                      css={css`
                        text-align: right;
                      `}
                    >
                      <Link href="/reset_password" passHref>
                        <a
                          css={css`
                            font-size: 12px;
                            margin-top: 2px;
                          `}
                        >
                          パスワードをお忘れの方はこちら
                        </a>
                      </Link>
                    </div>
                  </>
                </InputGroup>
                <Button
                  intent="primary"
                  component="button"
                  style={{
                    marginTop: 24,
                    width: '100%'
                  }}
                >
                  ログイン
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
          <Link href="/gishohaku1/privacy" passHref>
            <a>利用規約/プライバシーポリシー</a>
          </Link>
          に同意するものとします
        </p>
        <Divider />
        <Link href="/sign_up">
          <Button component="a" block variant="outline">
            会員登録はこちら
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

export default withRouter(SignIn)
