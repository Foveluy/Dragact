'use strict'
import React from 'react';
import ReactDOM from 'react-dom';
import { LayoutDemo } from './App';


ReactDOM.render(
    <div>
        <LayoutDemo />
    </div>,
    document.getElementById('root')
);

document.body.addEventListener('touchmove', function (event) {
    event.preventDefault();
}, false);

// const ThemeContext = React.createContext();

// class ThemeProvider extends React.Component {
//     state = {
//         theme: "dark",
//         color: "blue"
//     };

//     changeTheme = theme => {
//         this.setState({
//             theme
//         });
//     };

//     changeColor = color => {
//         this.setState({
//             color
//         });
//     };

//     render() {
//         return (
//             <ThemeContext.Provider
//                 value={{
//                     theme: this.state.theme,
//                     color: this.state.color,
//                     changeColor: this.changeColor
//                 }}
//             >
//                 <button onClick={() => this.changeTheme("light")}>change theme</button>
//                 {this.props.children}
//             </ThemeContext.Provider>
//         );
//     }
// }
// const SubComponent = props => (
//     <div>
//         <div>{props.theme}</div>
//         <button onClick={() => props.changeColor("red")}>change color</button>
//         <div>{props.color}</div>
//         <ThemeContext.Consumer>
//             {context => (
//                 <div>{context.theme}{context.color}{context.changeColor}
//                 </div>
//             )}
//         </ThemeContext.Consumer>
//     </div>
// );
// class App extends React.Component {
//     render() {
//         return (
//             <ThemeProvider>
//                 <ThemeContext.Consumer>
//                     {context => (
//                         <SubComponent
//                             theme={context.theme}
//                             color={context.color}
//                             changeColor={context.changeColor}
//                         />
//                     )}
//                 </ThemeContext.Consumer>
//             </ThemeProvider>
//         );
//     }
// }

// ReactDOM.render(<App />, document.getElementById("root"));