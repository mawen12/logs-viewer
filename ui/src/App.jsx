import { HashRouter, Routes, Route } from "react-router-dom"
import LogsLayout from "./layouts/LogsLayout/LogsLayout"

const App = () => {

    return <>
        <HashRouter>
            <Routes>
                <Route 
                    path={"/"}
                    element={<LogsLayout/>}
                >
                    <Route
                        path={"/"}
                        element={<QueryPage/>}
                    />
                </Route>
            </Routes>
        </HashRouter>
    </>
}