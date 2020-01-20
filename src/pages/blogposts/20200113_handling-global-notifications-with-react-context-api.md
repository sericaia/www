---
title: "Handling global notifications with React's Context API"
date: '2020-01-13'
---

In this article, we aim to present a use case on how to use [React Hooks](https://reactjs.org/docs/hooks-intro.html) and [Context API](https://reactjs.org/docs/context.html) in order to show notifications globally. The example presented here creates a way to show error messages (namely API error messages) reported by feature components (our pages) when a request is performed. The approach presented here was inspired by the [pattern extinction level event](https://ponyfoo.com/articles/discovering-patterns-with-react-hooks). In the end, we also explain how to easily test some of the components created. You can find the [full code examples described in this blogpost in this codesandbox](https://codesandbox.io/s/patient-sunset-w7l0l).

## Folder structure

We have a folder structure similar to the following:

```
/ src
--- / common
------ / api
------ / hooks
------ / providers
------ / routing
------ / test-utils
------ ...
------ App.js
--- / components
--- / features
--- / ...
package.json
```

`src/App.js` is the entry point for our React application, similar to what is created with [Create React App](https://create-react-app.dev/).

The `src/components` folder contains basic react components that range from Button to Modal, Header, Footer, etc (for such a simple project we didn't feel the need to split using something such as [atomic design](http://atomicdesign.bradfrost.com/)). The `features` folder contains the pages, that are smart components that handle network requests and the structure of the pages.

API requests, custom React Hooks and Providers created with Context API can be found in a `common` folder, as they can be shared through the components (namely, features).

OK, but what do we want exactly to do? a bottom-up approach to push errors and make them visible. Context seemed a good candidate to handle that.

## Setting up the context

Since we just need to show one error message at a time we can just save that `message` (string) and the `status` code in context. The functions to add and remove (clear) the error are also exposed in context through the provider.

```js
// src/common/providers/APIErrorProvider/index.js
import React, { useState, useCallback } from 'react'

export const APIErrorContext = React.createContext({
  error: null,
  addError: () => {},
  removeError: () => {},
})

export default function APIErrorProvider({ children }) {
  const [error, setError] = useState(null)

  const removeError = () => setError(null)

  const addError = (message, status) => setError({ message, status })

  const contextValue = {
    error,
    addError: useCallback((message, status) => addError(message, status), []),
    removeError: useCallback(() => removeError(), []),
  }

  return (
    <APIErrorContext.Provider value={contextValue}>
      {children}
    </APIErrorContext.Provider>
  )
}
```

## Adding the Provider to the application entry point

We need to add our `APIErrorProvider` pretty much we add other providers such as Authentication provider or [Material ui](https://material-ui.com/customization/theming/#theming) to our main App component.

```js
// src/App.js
import React from 'react'
import APIErrorProvider from './common/providers/APIErrorProvider'
import APIErrorNotification from './components/APIErrorNotification'

function App() {
  return (
    <AuthProvider>
      <APIErrorProvider>
        {/* routing, feature components, etc */}
        <APIErrorNotification />
      </APIErrorProvider>
    </AuthProvider>
  )
}

export default App
```

> Note that we also add `APIErrorNotification` component here which is the component that will render our popup notification with the error.

## Using your own hook and avoid having to do `useContext` in every component

The `useAPIError` custom hook does not do anything fancy but makes the code more readable and avoids having to write too many lines. It exposes the `addError` and `removeError` functions and the `error` to used by `APIErrorNotification`.

```js
// src/common/hooks/useAPIError/index.js
import { useContext } from 'react'
import { APIErrorContext } from '../../providers/APIErrorProvider'

function useAPIError() {
  const { error, addError, removeError } = useContext(APIErrorContext)
  return { error, addError, removeError }
}

export default useAPIError
```

## Use the hook in a page

Now we can use our custom hook in a feature page, such as the following example. Here we are doing a request to an API when the component mounts (`useEffect` with no dependencies). If the request fails we call the `addError` method in our Provider and the context gets updated.

```js
// src/features/HomePage/index.js
import useAPIError from '../../common/hooks/useAPIError'
import api from '../../common/api'

function HomePage() {
  const { addError } = useAPIError()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.getData()

        // do something useful with the data
      } catch (err) {
        addError(`LOAD_DATA_ERROR: ${err}`, err.response.status)
      }
    }

    fetchData()
  }, [addError])

  return <div>Will render some data</div>
}
```

## Render the error globally

Once the context gets updated, the `APIErrorNotification` is notified that its value changed and rerenders. We can show a message in a paragraph (or markup, why not?), use a modal, a toast / snackbar or other. In this case, imagine that we have a modal component that just shows up when there's an error:

```js
// src/components/APIErrorNotification/index.js
import useAPIError from '../../common/hooks/useAPIError'
import Modal from '../../components/Modal'

function APIErrorNotification() {
  const { error, removeError } = useAPIError()

  const handleSubmit = () => {
    removeError()
  }

  return (
    <Modal open={!!error} data-testid="notification-modal">
      <div>
        {error && error.message && <p>({error.message})</p>}
        <button data-testid="notification-submit-button" onClick={handleSubmit}>
          Ok
        </button>
      </div>
    </Modal>
  )
}
```

> Note that the way to remove the error message is to submits the modal, which will update the context and trigger a rerender where modal will not show up.

## Testing

We are going to use [@testing-library/react](https://github.com/testing-library/react-testing-library) in the following examples. It is really simple to use, and the whole idea is to test as a user which helps to identify the use cases and meet user acceptance criteria. There is also [react-hooks-testing-library](https://github.com/testing-library/react-hooks-testing-library) which might help to test our custom hooks.

```js
// src/common/test-utils/render-component.js
import React from 'react'
import { render } from '@testing-library/react'

import { AuthContext } from '../providers/AuthProvider'
import { APIErrorContext } from '../providers/APIErrorProvider'

// Mocks
const errorMock = null

export default function renderComponent(
  children,
  {
    // ... other props
    error = errorMock,
  } = {}
) {
  const addErrorSpy = jest.fn()
  const removeErrorSpy = jest.fn()

  return {
    ...render(
      // add other providers such as AuthContext
      <APIErrorContext.Provider
        value={{
          error,
          addError: addErrorSpy,
          removeError: removeErrorSpy,
        }}
      >
        {children}
      </APIErrorContext.Provider>
    ),
    addErrorSpy,
    removeErrorSpy,
  }
}
```

From this example you can see that:

- We can pass a custom error message or just use a mocked one;
- We are extending the functions provided by `@testing-library/react` (`getByTestId`, `queryByTestId`, etc) which means that we test `addErrorSpy` and `removeErrorSpy` usages properly.

In order to use it on a test we can do the following:

```js
const { addErrorSpy, removeErrorSpy } = renderComponent(
  <ComponentThatUsesContext />,
  {
    error: {
      message: 'SOME_ERROR',
    },
  }
)
```

For example, if we add the `data-testid` attribute to the submit button on the `APIErrorNotification` component we can trigger it and confirm that `removeErrorSpy` was called when the button was pressed.

```js
// src/components/APIErrorNotification/APIErrorNotification.test.js
import React from 'react'
import { fireEvent, wait } from '@testing-library/react'
import renderComponent from '../../common/test-utils/render-component'
import APIErrorNotification from './'

it('should remove error when handleSubmit is pressed', async () => {
  const ERROR_MESSAGE = 'SOME_ERROR'
  const { getByTestId, removeErrorSpy } = renderComponent(
    <APIErrorNotification />,
    {
      error: {
        message: ERROR_MESSAGE,
      },
    }
  )

  wait(() => {
    const submitModalBtn = getByTestId('notification-submit-button')
    fireEvent.click(submitModalBtn)

    expect(removeErrorSpy).toHaveBeenCalled()
  })
})
```

Note that we wanted to show how it is possible to test the functions of the provider. However, in this particular example we could just have tested that the modal was not visible anymore, e.g.

```js
// src/components/APIErrorNotification/APIErrorNotification.test.js
it('should not show modal when handleSubmit is pressed', async () => {
  const ERROR_MESSAGE = 'SOME_ERROR'
  const { getByTestId, queryByTestId } = renderComponent(
    <APIErrorNotification />,
    {
      error: {
        message: ERROR_MESSAGE,
      },
    }
  )

  wait(() => {
    const submitModalBtn = getByTestId('notification-submit-button')
    fireEvent.click(submitModalBtn)

    const modal = queryByTestId('notification-modal')
    expect(modal).toBeNull()
  })
})
```

We hope this gave some ideas on how to use Context API and on how to test your use cases. Happy coding!

_Originally published at [blog.yld.io](https://blog.yld.io/) on January 13, 2020 by Daniela Matos de Carvalho (@sericaia on Twitter/Github)_
