/* eslint-disable @typescript-eslint/explicit-function-return-type */
import styled from 'styled-components'

// ======= Login status icon ==========
export const LogInStatus = styled.p.attrs<{ login: 'boolean' }>((props) => {
  return { login: props.login }
})<{ login: boolean }>`
  background-color: ${(props) => (props.login ? '	#92e247' : 'red')};
  color: ${(props) => (props.login ? 'black' : 'white')};
  width: 0.4em;
  height: 0.4em;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
`
// ================================

// ======= First row in info card =======
export const CarRow1 = styled.div`
  width: 100%;
  height: 18px;
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-bottom: 2px solid black;
`

export const AmrTitle = styled.h2`
  font-size: 9px;
  line-height: 100%;
  text-align: center;
  font-weight: 1000;
  width: 100%;
  color: #000080;
  white-space: nowrap;
`
// ==============================

// ======Second row in info card ============

export const CarRow2 = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
`

export const CarStatus = styled.span`
  font-weight: bold;
  font-size: 70%;
  padding-top: 1px;
  margin-top: 1px;
  text-align: center;
  color: red;
  margin-right: 3px;
`
// ==============================

// ======= Third row in info ===============

export const CarRow3 = styled.div`
  width: 100%;
  display: flex;
  margin-top: 5px;
  justify-content: space-around;
  align-items: center;
  overflow: hidden;
  font-size: 75%;
  font-weight: bold;
  /* @media screen and (max-width: 960px) {
    font-size: 40%;
  } */
`
export const TextWrap = styled.div`
  margin-top: 1px;
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 35px;
  overflow: hidden;
`

// ==============================
