const { widget } = figma
const { useEffect, useSyncedState, usePropertyMenu, AutoLayout, Input, Frame, Text, SVG } = widget

function Widget() {
  const [statusOption, setStatus] = useSyncedState<string>('status', '#6D6D6D');
  const [priority, setPriority] = useSyncedState<string>('priority', 'p1');
  const [theme, setTheme] = useSyncedState<string>('theme', 'portfolio');
  const [impact, setImpact] = useSyncedState<string>('impact', 'low');
  const [effort, setEffort] = useSyncedState<string>('effort', 'medium');
  const [confidence, setConfidence] = useSyncedState<string>('confidence', 'high');
  const [name, setName] = useSyncedState('name', '[Enter your name]')
  const [initiatives, setInitiatives] = useSyncedState('initiatives', {
    initiative_one: "📊 Automated Portfolio",
    initiative_two: "💰 Trality Wallets & Traditional Assets",
    initiative_three: "📱 Mobile App",
    initiative_four: "🔄 CX Improvements",
    initiative_five: "🧩 Other Strategic Bets",
  })
  const [bgColors, setBgColors] = useSyncedState('bgColors', {
    color_one: "#CCF1FA",
    color_two: "#F8F6CF",
    color_three: "#F6E8FF",
    color_four: "#D4EDDD",
    color_five: "#E6E6E6",
  })

  function calculateTextColor(bgColor) {
    const colorMapping = [
      { bgColor: "#CCF1FA", textColor: "#00B8E6" },
      { bgColor: "#F8F6CF", textColor: "#857F0A" },
      { bgColor: "#F6E8FF", textColor: "#7B61FF" },
      { bgColor: "#D4EDDD", textColor: "#2AA653" },
      { bgColor: "#E6E6E6", textColor: "#6D6D6D" },
    ];
  
    const foundMapping = colorMapping.find((mapping) => mapping.bgColor === bgColor);
  
    if (foundMapping) {
      return foundMapping.textColor;
    } else {
      const r = parseInt(bgColor.slice(1, 3), 16);
      const g = parseInt(bgColor.slice(3, 5), 16);
      const b = parseInt(bgColor.slice(5, 7), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  
      // Lighten or darken the color by a factor (e.g., 0.2 for 20%)
      const factor = 0.2;
  
      if (yiq >= 128) {
        // If the bgColor is light, return a darker font color
        const factor = 0.459;
        const rDark = Math.max(Math.floor(r * (1 - factor)), 0);
        const gDark = Math.max(Math.floor(g * (1 - factor)), 0);
        const bDark = Math.max(Math.floor(b * (1 - factor)), 0);
        return `#${rDark.toString(16).padStart(2, '0')}${gDark.toString(16).padStart(2, '0')}${bDark.toString(16).padStart(2, '0')}`;
      } else {
        // If the bgColor is dark, return a lighter font color
        const factor = 0.7;
        const rLight = Math.min(Math.floor(r * (1 + factor)), 255);
        const gLight = Math.min(Math.floor(g * (1 + factor)), 255);
        const bLight = Math.min(Math.floor(b * (1 + factor)), 255);
        return `#${rLight.toString(16).padStart(2, '0')}${gLight.toString(16).padStart(2, '0')}${bLight.toString(16).padStart(2, '0')}`;
      }
    }
  }

  useEffect(() => {
    figma.ui.onmessage = (message) => {
      const bgColors = message.bgColors.bgColors;
      if (message.initiatives.type === 'initiatives') {
        const initiatives = message.initiatives.initiatives;
        setInitiatives({
          ...initiatives,
          initiative_one: initiatives.initiative_one,
          initiative_two: initiatives.initiative_two,
          initiative_three: initiatives.initiative_three,
          initiative_four: initiatives.initiative_four,
          initiative_five: initiatives.initiative_five,
        })
      }
      if (message.bgColors.type === 'bgColors') {
        const bgColors = message.bgColors.bgColors;
        setBgColors({
          ...bgColors,
          color_one: bgColors.color_one.toUpperCase(),
          color_two: bgColors.color_two.toUpperCase(),
          color_three: bgColors.color_three.toUpperCase(),
          color_four: bgColors.color_four.toUpperCase(),
          color_five: bgColors.color_five.toUpperCase(),
        })
      }
      figma.closePlugin()
    }
  })
   
  function showSettings(){
    return new Promise((resolve) => {
      figma.showUI(`
        <div style="font-family:'Inter';font-size:10pt;">
        <b>Please change the name of the initiatives below.</b>
        <br><br>Initative 1: <input id="initiative_one" type="text" value="${initiatives.initiative_one}" style="height:22px;">
        <input id="color_one" type="color" value="${bgColors.color_one}" style="height:22px;">
        <br>Initative 2: <input id="initiative_two" type="text" value="${initiatives.initiative_two}">
        <input id="color_two" type="color" value="${bgColors.color_two}" style="height:22px;">
        <br>Initative 3: <input id="initiative_three" type="text" value="${initiatives.initiative_three}">
        <input id="color_three" type="color" value="${bgColors.color_three}" style="height:22px;">
        <br>Initative 4: <input id="initiative_four" type="text" value="${initiatives.initiative_four}">
        <input id="color_four" type="color" value="${bgColors.color_four}" style="height:22px;">
        <br>Initative 5: <input id="initiative_five" type="text" value="${initiatives.initiative_five}">
        <input id="color_five" type="color" value="${bgColors.color_five}" style="height:22px;">
        <br><button id="submit">Submit</button>
        </div>
        <script>
          document.getElementById('submit').onclick = () => {
            const initiative_one = document.getElementById('initiative_one').value;
            const initiative_two = document.getElementById('initiative_two').value;
            const initiative_three = document.getElementById('initiative_three').value;
            const initiative_four = document.getElementById('initiative_four').value;
            const initiative_five = document.getElementById('initiative_five').value;
            const color_one = document.getElementById('color_one').value;
            const color_two = document.getElementById('color_two').value;
            const color_three = document.getElementById('color_three').value;
            const color_four = document.getElementById('color_four').value;
            const color_five = document.getElementById('color_five').value;
            const initiatives = {'initiative_one':initiative_one, 'initiative_two':initiative_two,'initiative_three':initiative_three,'initiative_four':initiative_four,'initiative_five':initiative_five, };
            const bgColors = {'color_one':color_one, 'color_two':color_two,'color_three':color_three,'color_four':color_four,'color_five':color_five, };
            const message_initiatives = {type: 'initiatives', initiatives}
            const message_bgColors = {type: 'bgColors', bgColors}
            parent.postMessage({pluginMessage:{'initiatives':message_initiatives,'bgColors':message_bgColors}}, '*')
          
            //const initiatives = {'initiative_one':initiative_one, 'initiative_two':initiative_two,'initiative_three':initiative_three,'initiative_four':initiative_four,'initiative_five':initiative_five, };
            //const message = { pluginMessage: {type: 'initiatives', initiatives} }
            //parent.postMessage(message, '*')
          }
        </script>
        
        
    `)
    })
  }
  
  
  const priorityOptions = [
    { option: 'p1', label: 'P1 \u{1F534}' },
    { option: 'p2', label: 'P2 \u{1F7E1}' },
    { option: 'p3', label: 'P3 \u{1F7E2}' },
    { option: 'unknown', label: 'Unknown \u26AA\uFE0F' },
  ];
  const effortOptions = [
    { option: 'low', label: 'Low' },
    { option: 'medium', label: 'Medium' },
    { option: 'high', label: 'High' },
    { option: 'unknown', label: 'Unknown' },
  ];
  const confidenceOptions = [
    { option: 'low', label: 'Low' },
    { option: 'medium', label: 'Medium' },
    { option: 'high', label: 'High' },
    { option: 'unknown', label: 'Unknown' },
  ];
  const impactOptions = [
    { option: 'low', label: 'Low' },
    { option: 'medium', label: 'Medium' },
    { option: 'high', label: 'High' },
    { option: 'unknown', label: 'Unknown' },
  ];
  const themeOptions = [
    { option: 'portfolio', label: initiatives.initiative_one },
    { option: 'wallets', label: initiatives.initiative_two },
    { option: 'mobile', label: initiatives.initiative_three },
    { option: 'cx', label: initiatives.initiative_four },
    { option: 'others', label: initiatives.initiative_five },

  ];
  const statusOptions = [
    { option: '#6d6d6d', tooltip: 'Not Started' },
    { option: '#7b61ff', tooltip: 'In Design' },
    { option: '#857f0a', tooltip: 'In Development' },
    { option: '#e63939', tooltip: 'Blocked' },
    { option: '#00b8e6', tooltip: 'In Testing' },
    { option: '#2aa653', tooltip: 'Done' }
  ]
  usePropertyMenu(
    [
      {
        itemType: 'dropdown',
        propertyName: 'priorities',
        tooltip: 'Priority selector',
        selectedOption: priority,
        options: priorityOptions,
      },
      {
        itemType: 'dropdown',
        propertyName: 'themes',
        tooltip: 'Theme selector',
        selectedOption: theme,
        options: themeOptions,
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'color-selector',
        propertyName: 'status',
        tooltip: 'Status selector',
        selectedOption: statusOption,
        options: statusOptions,
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'dropdown',
        propertyName: 'effort',
        tooltip: 'Effort selector',
        selectedOption: effort,
        options: effortOptions,
      },
      {
        itemType: 'dropdown',
        propertyName: 'impact',
        tooltip: 'Impact selector',
        selectedOption: impact,
        options: impactOptions,
      },
      {
        itemType: 'dropdown',
        propertyName: 'confidence',
        tooltip: 'Confidence selector',
        selectedOption: confidence,
        options: confidenceOptions,
      },
      {
        itemType: 'separator',
      },
      {
        itemType: 'action',
        propertyName: 'settings',
        tooltip: 'Open settings',
      },
    ],
    async ({ propertyName, propertyValue }) => {
     if (propertyName === 'priorities') {
        setPriority(propertyValue);
      } else if (propertyName === 'themes') {
        setTheme(propertyValue);
      } else if (propertyName === 'effort') {
        setEffort(propertyValue);
      } else if (propertyName === 'impact') {
        setImpact(propertyValue);
      } else if (propertyName === 'confidence') {
        setConfidence(propertyValue);
      } else if (propertyName === 'status') {
        setStatus(propertyValue);
      } else if (propertyName === 'settings'){
          await showSettings();
      }
    }
  );
  

  const firstText = "Create interesting and exciting information that makes creators proud of their marketplace bot.\n\nIncentivise creators to get more followers by giving them rewards for reaching certain milestones & having their own referral codes.";
  const firstHeadline = "Analytics & Milestones";
  const [text, setText] = useSyncedState("text", firstText);
  const [headline, setHeadline] = useSyncedState("headline", firstHeadline);


  //setting colors 
  
  const priorityColors = [
    { option: 'p1', label: 'P1 \u{1F534}', color: "#FAD7D7CC", textColor: "#E63939" },
    { option: 'p2', label: 'P2 \u{1F7E1}', color: "#F8F6CFCC", textColor: "#857F0A" },
    { option: 'p3', label: 'P3 \u{1F7E2}', color: "#D4EDDDCC", textColor: "#2AA653" },
    { option: 'unknown', label: 'Unknown \u26AA\uFE0F', color: "#E6E6E6CC", textColor: "#6D6D6D" },
  ];
  const effortColors = [
    { option: 'low', label: 'Low', color: "#D4EDDDCC", textColor: "#2AA653" },
    { option: 'medium', label: 'Medium', color: "#F8F6CFCC", textColor: "#857F0A" },
    { option: 'high', label: 'High', color: "#FAD7D7CC", textColor: "#E63939" },
    { option: 'unknown', label: 'Unknown', color: "#E6E6E6CC", textColor: "#6D6D6D" },
  ];
  const confidenceColors = [
    { option: 'low', label: 'Low', color: "#FAD7D7CC", textColor: "#E63939" },
    { option: 'medium', label: 'Medium', color: "#F8F6CFCC", textColor: "#857F0A" },
    { option: 'high', label: 'High', color: "#D4EDDDCC", textColor: "#2AA653" },
    { option: 'unknown', label: 'Unknown', color: "#E6E6E6CC", textColor: "#6D6D6D" },
  ];
  const impactColors = [
    { option: 'low', label: 'Low', color: "#D4EDDDCC", textColor: "#2AA653" },
    { option: 'medium', label: 'Medium', color: "#F8F6CFCC", textColor: "#857F0A" },
    { option: 'high', label: 'High', color: "#FAD7D7CC", textColor: "#E63939" },
    { option: 'unknown', label: 'Unknown', color: "#E6E6E6CC", textColor: "#6D6D6D" },
  ];
  const themeColors = [
    { option: 'portfolio', label: initiatives.initiative_one, color: bgColors.color_one, textColor: calculateTextColor(bgColors.color_one) },
    { option: 'wallets', label: initiatives.initiative_two, color: bgColors.color_two, textColor: calculateTextColor(bgColors.color_two) },
    { option: 'mobile', label: initiatives.initiative_three, color: bgColors.color_three, textColor: calculateTextColor(bgColors.color_three) },
    { option: 'cx', label: initiatives.initiative_four, color: bgColors.color_four, textColor: calculateTextColor(bgColors.color_four) },
    { option: 'others', label: initiatives.initiative_five, color: bgColors.color_five, textColor: calculateTextColor(bgColors.color_five) },
  ];
  const statusColors = [
    { option: '#6D6D6D', color: '#E6E6E6CC', tooltip: 'Not Started', textColor: "#6D6D6D" },
    { option: '#7B61FF', color: '#F6E8FF', tooltip: 'In Design', textColor: "#7B61FF" },
    { option: '#857F0A', color: '#F8F6CFCC', tooltip: 'In Development', textColor: "#857F0A" },
    { option: '#E63939', color: '#FAD7D7CC', tooltip: 'Blocked', textColor: "#E63939" },
    { option: '#00B8E6', color: '#CCF1FACC', tooltip: 'In Testing', textColor: "#00B8E6" },
    { option: '#2AA653', color: '#D4EDDDCC', tooltip: 'Done', textColor: "#2AA653" }
  ]
  console.log(statusOption);

  const confidenceSvg = `
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"
    xmlns="http://www.w3.org/2000/svg" style="margin-left: 4px;">
    <path
        d="M13.3 12.22C13.8336 11.7581 14.2616 11.1869 14.5549 10.545C14.8482 9.90316 15 9.20571 15 8.5C15 7.17392 14.4732 5.90215 13.5355 4.96447C12.5979 4.02678 11.3261 3.5 10 3.5C8.67392 3.5 7.40215 4.02678 6.46447 4.96447C5.52678 5.90215 5 7.17392 5 8.5C4.99999 9.20571 5.1518 9.90316 5.44513 10.545C5.73845 11.1869 6.16642 11.7581 6.7 12.22C5.30014 12.8539 4.11247 13.8775 3.27898 15.1685C2.4455 16.4596 2.00147 17.9633 2 19.5C2 19.7652 2.10536 20.0196 2.29289 20.2071C2.48043 20.3946 2.73478 20.5 3 20.5C3.26522 20.5 3.51957 20.3946 3.70711 20.2071C3.89464 20.0196 4 19.7652 4 19.5C4 17.9087 4.63214 16.3826 5.75736 15.2574C6.88258 14.1321 8.4087 13.5 10 13.5C11.5913 13.5 13.1174 14.1321 14.2426 15.2574C15.3679 16.3826 16 17.9087 16 19.5C16 19.7652 16.1054 20.0196 16.2929 20.2071C16.4804 20.3946 16.7348 20.5 17 20.5C17.2652 20.5 17.5196 20.3946 17.7071 20.2071C17.8946 20.0196 18 19.7652 18 19.5C17.9985 17.9633 17.5545 16.4596 16.721 15.1685C15.8875 13.8775 14.6999 12.8539 13.3 12.22ZM10 11.5C9.40666 11.5 8.82664 11.3241 8.33329 10.9944C7.83994 10.6648 7.45542 10.1962 7.22836 9.64805C7.0013 9.09987 6.94189 8.49667 7.05764 7.91473C7.1734 7.33279 7.45912 6.79824 7.87868 6.37868C8.29824 5.95912 8.83279 5.6734 9.41473 5.55764C9.99667 5.44189 10.5999 5.5013 11.1481 5.72836C11.6962 5.95542 12.1648 6.33994 12.4944 6.83329C12.8241 7.32664 13 7.90666 13 8.5C13 9.29565 12.6839 10.0587 12.1213 10.6213C11.5587 11.1839 10.7956 11.5 10 11.5ZM21.71 9.13C21.617 9.03627 21.5064 8.96188 21.3846 8.91111C21.2627 8.86034 21.132 8.8342 21 8.8342C20.868 8.8342 20.7373 8.86034 20.6154 8.91111C20.4936 8.96188 20.383 9.03627 20.29 9.13L18.29 11.13L17.67 10.5C17.577 10.4063 17.4664 10.3319 17.3446 10.2811C17.2227 10.2303 17.092 10.2042 16.96 10.2042C16.828 10.2042 16.6973 10.2303 16.5754 10.2811C16.4536 10.3319 16.343 10.4063 16.25 10.5C16.0637 10.6874 15.9592 10.9408 15.9592 11.205C15.9592 11.4692 16.0637 11.7226 16.25 11.91L17.59 13.25C17.7774 13.4363 18.0308 13.5408 18.295 13.5408C18.5592 13.5408 18.8126 13.4363 19 13.25L21.67 10.58C21.771 10.4893 21.8524 10.379 21.9094 10.2559C21.9664 10.1327 21.9977 9.99924 22.0014 9.86359C22.0052 9.72794 21.9813 9.59294 21.9312 9.46682C21.8811 9.34071 21.8058 9.22611 21.71 9.13Z"
        fill="${confidenceColors.find((f) => f.option === confidence)?.textColor}"></path>
    </svg>
  `;

  const impactSvg = `
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"
    xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px;">
    <path
        d="M21.9199 6.62C21.8185 6.37565 21.6243 6.18147 21.3799 6.08C21.2597 6.02876 21.1306 6.00158 20.9999 6H15.9999C15.7347 6 15.4804 6.10536 15.2928 6.29289C15.1053 6.48043 14.9999 6.73478 14.9999 7C14.9999 7.26522 15.1053 7.51957 15.2928 7.70711C15.4804 7.89464 15.7347 8 15.9999 8H18.5899L12.9999 13.59L9.70994 10.29C9.61698 10.1963 9.50638 10.1219 9.38452 10.0711C9.26266 10.0203 9.13195 9.9942 8.99994 9.9942C8.86793 9.9942 8.73722 10.0203 8.61536 10.0711C8.4935 10.1219 8.3829 10.1963 8.28994 10.29L2.28994 16.29C2.19621 16.383 2.12182 16.4936 2.07105 16.6154C2.02028 16.7373 1.99414 16.868 1.99414 17C1.99414 17.132 2.02028 17.2627 2.07105 17.3846C2.12182 17.5064 2.19621 17.617 2.28994 17.71C2.3829 17.8037 2.4935 17.8781 2.61536 17.9289C2.73722 17.9797 2.86793 18.0058 2.99994 18.0058C3.13195 18.0058 3.26266 17.9797 3.38452 17.9289C3.50637 17.8781 3.61698 17.8037 3.70994 17.71L8.99994 12.41L12.2899 15.71C12.3829 15.8037 12.4935 15.8781 12.6154 15.9289C12.7372 15.9797 12.8679 16.0058 12.9999 16.0058C13.132 16.0058 13.2627 15.9797 13.3845 15.9289C13.5064 15.8781 13.617 15.8037 13.7099 15.71L19.9999 9.41V12C19.9999 12.2652 20.1053 12.5196 20.2928 12.7071C20.4804 12.8946 20.7347 13 20.9999 13C21.2652 13 21.5195 12.8946 21.707 12.7071C21.8946 12.5196 21.9999 12.2652 21.9999 12V7C21.9984 6.86932 21.9712 6.74022 21.9199 6.62V6.62Z"
        fill="${impactColors.find((f) => f.option === impact)?.textColor}"></path>
    </svg>
  `;

  const effortSvg = `
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"
    xmlns="http://www.w3.org/2000/svg" style="margin-left: 8px;">
    <path
      d="M21.71 15.5799L17.19 11.0699C17.2846 10.6093 17.3315 10.1401 17.33 9.66988C17.3296 8.38054 17.0042 7.11208 16.3839 5.98177C15.7636 4.85145 14.8683 3.89576 13.7809 3.20303C12.6934 2.51029 11.4489 2.10287 10.1623 2.01842C8.87572 1.93398 7.58862 2.17523 6.41995 2.71988C6.27189 2.78752 6.14258 2.89028 6.04324 3.01924C5.94391 3.1482 5.87756 3.29946 5.84995 3.45988C5.82246 3.61827 5.83355 3.78095 5.88229 3.93414C5.93103 4.08733 6.01599 4.22651 6.12995 4.33988L10.48 8.67988L8.67995 10.4799L4.33995 6.12988C4.22562 6.01769 4.08601 5.9346 3.93287 5.88761C3.77972 5.84062 3.61754 5.83112 3.45995 5.85988C3.30053 5.88648 3.14994 5.95132 3.02106 6.04885C2.89218 6.14638 2.78886 6.27369 2.71995 6.41988C2.17348 7.59239 1.93243 8.88406 2.01924 10.1747C2.10606 11.4654 2.5179 12.7132 3.21647 13.802C3.91503 14.8907 4.87762 15.7851 6.0147 16.4019C7.15177 17.0188 8.42638 17.338 9.71995 17.3299C10.1902 17.3314 10.6593 17.2845 11.12 17.1899L15.63 21.7099C15.7229 21.8036 15.8335 21.878 15.9554 21.9288C16.0772 21.9795 16.2079 22.0057 16.34 22.0057C16.472 22.0057 16.6027 21.9795 16.7245 21.9288C16.8464 21.878 16.957 21.8036 17.05 21.7099C17.1437 21.6169 17.2181 21.5063 17.2688 21.3845C17.3196 21.2626 17.3458 21.1319 17.3458 20.9999C17.3458 20.8679 17.3196 20.7372 17.2688 20.6153C17.2181 20.4934 17.1437 20.3828 17.05 20.2899L12.15 15.3899C12.0275 15.2682 11.8757 15.1804 11.7092 15.1348C11.5427 15.0893 11.3673 15.0876 11.2 15.1299C10.7171 15.2592 10.2198 15.3264 9.71995 15.3299C8.972 15.3365 8.23014 15.195 7.53709 14.9137C6.84405 14.6323 6.21353 14.2166 5.68184 13.6905C5.15016 13.1644 4.72783 12.5383 4.43917 11.8482C4.15052 11.1582 4.00124 10.4179 3.99995 9.66988C3.99866 9.3349 4.02542 9.0004 4.07995 8.66988L7.99995 12.5999C8.09292 12.6936 8.20352 12.768 8.32538 12.8188C8.44724 12.8695 8.57794 12.8957 8.70995 12.8957C8.84197 12.8957 8.97267 12.8695 9.09453 12.8188C9.21639 12.768 9.32699 12.6936 9.41995 12.5999L12.6 9.38988C12.7802 9.20342 12.8809 8.95422 12.8809 8.69488C12.8809 8.43554 12.7802 8.18635 12.6 7.99988L8.70995 4.07988C9.04054 4.0259 9.37499 3.99914 9.70995 3.99988C11.212 4.00253 12.6516 4.60108 13.7128 5.66412C14.774 6.72716 15.37 8.16784 15.37 9.66988C15.3665 10.1697 15.2993 10.6671 15.17 11.1499C15.1276 11.3172 15.1293 11.4926 15.1749 11.6591C15.2204 11.8256 15.3083 11.9774 15.43 12.0999L20.33 16.9999C20.5183 17.1882 20.7737 17.294 21.04 17.294C21.3063 17.294 21.5616 17.1882 21.75 16.9999C21.9383 16.8116 22.044 16.5562 22.044 16.2899C22.044 16.0236 21.9383 15.7682 21.75 15.5799H21.71Z"
      fill="${effortColors.find((f) => f.option === effort)?.textColor}"></path>
    </svg>
  `;

  const statusSvg = `
    <svg width="9" height="9" viewBox="0 0 24 24" fill="#FFF"
    style="margin-left: 8px;">
    <path
      d="M21.32 9.55L19.43 8.92L20.32 7.14C20.4102 6.95369 20.4404 6.74397 20.4064 6.53978C20.3723 6.33558 20.2758 6.14699 20.13 6L18 3.87C17.8522 3.72209 17.6618 3.62421 17.4555 3.59013C17.2493 3.55605 17.0375 3.58748 16.85 3.68L15.07 4.57L14.44 2.68C14.3735 2.483 14.2472 2.31163 14.0787 2.18975C13.9102 2.06787 13.7079 2.00155 13.5 2H10.5C10.2904 1.99946 10.0858 2.06482 9.91537 2.18685C9.7449 2.30887 9.61709 2.48138 9.55 2.68L8.92 4.57L7.14 3.68C6.95369 3.58978 6.74397 3.55961 6.53978 3.59364C6.33558 3.62767 6.14699 3.72423 6 3.87L3.87 6C3.72209 6.14777 3.62421 6.33818 3.59013 6.54446C3.55605 6.75074 3.58748 6.96251 3.68 7.15L4.57 8.93L2.68 9.56C2.483 9.62654 2.31163 9.75283 2.18975 9.92131C2.06787 10.0898 2.00155 10.2921 2 10.5V13.5C1.99946 13.7096 2.06482 13.9142 2.18685 14.0846C2.30887 14.2551 2.48138 14.3829 2.68 14.45L4.57 15.08L3.68 16.86C3.58978 17.0463 3.55961 17.256 3.59364 17.4602C3.62767 17.6644 3.72423 17.853 3.87 18L6 20.13C6.14777 20.2779 6.33818 20.3758 6.54446 20.4099C6.75074 20.444 6.96251 20.4125 7.15 20.32L8.93 19.43L9.56 21.32C9.62709 21.5186 9.7549 21.6911 9.92537 21.8132C10.0958 21.9352 10.3004 22.0005 10.51 22H13.51C13.7196 22.0005 13.9242 21.9352 14.0946 21.8132C14.2651 21.6911 14.3929 21.5186 14.46 21.32L15.09 19.43L16.87 20.32C17.0551 20.4079 17.2628 20.4369 17.4649 20.4029C17.667 20.3689 17.8538 20.2737 18 20.13L20.13 18C20.2779 17.8522 20.3758 17.6618 20.4099 17.4555C20.444 17.2493 20.4125 17.0375 20.32 16.85L19.43 15.07L21.32 14.44C21.517 14.3735 21.6884 14.2472 21.8103 14.0787C21.9321 13.9102 21.9985 13.7079 22 13.5V10.5C22.0005 10.2904 21.9352 10.0858 21.8132 9.91537C21.6911 9.7449 21.5186 9.61709 21.32 9.55ZM20 12.78L18.8 13.18C18.5241 13.2695 18.2709 13.418 18.0581 13.6151C17.8452 13.8122 17.6778 14.0533 17.5675 14.3216C17.4571 14.5899 17.4064 14.879 17.419 15.1688C17.4315 15.4586 17.5069 15.7422 17.64 16L18.21 17.14L17.11 18.24L16 17.64C15.7436 17.5122 15.4627 17.4411 15.1763 17.4313C14.89 17.4215 14.6049 17.4734 14.3403 17.5834C14.0758 17.6934 13.8379 17.8589 13.6429 18.0688C13.4479 18.2787 13.3003 18.5281 13.21 18.8L12.81 20H11.22L10.82 18.8C10.7305 18.5241 10.582 18.2709 10.3849 18.0581C10.1878 17.8452 9.94671 17.6778 9.67842 17.5675C9.41014 17.4571 9.12105 17.4064 8.83123 17.419C8.5414 17.4315 8.25777 17.5069 8 17.64L6.86 18.21L5.76 17.11L6.36 16C6.4931 15.7422 6.56852 15.4586 6.58105 15.1688C6.59358 14.879 6.5429 14.5899 6.43254 14.3216C6.32218 14.0533 6.15478 13.8122 5.94195 13.6151C5.72912 13.418 5.47595 13.2695 5.2 13.18L4 12.78V11.22L5.2 10.82C5.47595 10.7305 5.72912 10.582 5.94195 10.3849C6.15478 10.1878 6.32218 9.94671 6.43254 9.67842C6.5429 9.41014 6.59358 9.12105 6.58105 8.83123C6.56852 8.5414 6.4931 8.25777 6.36 8L5.79 6.89L6.89 5.79L8 6.36C8.25777 6.4931 8.5414 6.56852 8.83123 6.58105C9.12105 6.59358 9.41014 6.5429 9.67842 6.43254C9.94671 6.32218 10.1878 6.15478 10.3849 5.94195C10.582 5.72912 10.7305 5.47595 10.82 5.2L11.22 4H12.78L13.18 5.2C13.2695 5.47595 13.418 5.72912 13.6151 5.94195C13.8122 6.15478 14.0533 6.32218 14.3216 6.43254C14.5899 6.5429 14.879 6.59358 15.1688 6.58105C15.4586 6.56852 15.7422 6.4931 16 6.36L17.14 5.79L18.24 6.89L17.64 8C17.5122 8.25645 17.4411 8.53735 17.4313 8.82369C17.4215 9.11003 17.4734 9.39513 17.5834 9.65969C17.6934 9.92424 17.8589 10.1621 18.0688 10.3571C18.2787 10.5521 18.5281 10.6997 18.8 10.79L20 11.19V12.78ZM12 8C11.2089 8 10.4355 8.2346 9.77772 8.67413C9.11993 9.11365 8.60724 9.73836 8.30448 10.4693C8.00173 11.2002 7.92252 12.0044 8.07686 12.7804C8.2312 13.5563 8.61217 14.269 9.17158 14.8284C9.73099 15.3878 10.4437 15.7688 11.2196 15.9231C11.9956 16.0775 12.7998 15.9983 13.5307 15.6955C14.2616 15.3928 14.8864 14.8801 15.3259 14.2223C15.7654 13.5645 16 12.7911 16 12C16 10.9391 15.5786 9.92172 14.8284 9.17158C14.0783 8.42143 13.0609 8 12 8ZM12 14C11.6044 14 11.2178 13.8827 10.8889 13.6629C10.56 13.4432 10.3036 13.1308 10.1522 12.7654C10.0009 12.3999 9.96126 11.9978 10.0384 11.6098C10.1156 11.2219 10.3061 10.8655 10.5858 10.5858C10.8655 10.3061 11.2219 10.1156 11.6098 10.0384C11.9978 9.96126 12.3999 10.0009 12.7654 10.1522C13.1308 10.3036 13.4432 10.56 13.6629 10.8889C13.8827 11.2178 14 11.6044 14 12C14 12.5304 13.7893 13.0391 13.4142 13.4142C13.0391 13.7893 12.5304 14 12 14Z"
      fill="${statusColors.find((f) => f.option.toUpperCase() === statusOption.toUpperCase())?.textColor.toUpperCase()}"></path>
    </svg>
  `;

  const shadow: WidgetJSX.Effect = {
    type: "drop-shadow",
    color: {r: 0.16, g:0.183, b: 0.128, a:0.08},
    offset: { x: 0, y: 8 },
    blur: 24,
    spread: 8,
    showShadowBehindNode: false,
  };

  return (
    <AutoLayout
      verticalAlignItems={'center'}
      spacing={8}
      padding={16}
      cornerRadius={8}
      fill={'#FFFFFF'}
      direction="vertical"
      effect={shadow}
    > 
      <AutoLayout direction="horizontal" width={300} spacing={8}>
        <AutoLayout width={145} horizontalAlignItems={"start"}>
          <AutoLayout fill={priorityColors.find((f) => f.option === priority)?.color} padding={4} cornerRadius={4}>
            <Text fontSize={8} fontWeight={600} fill={priorityColors.find((f) => f.option === priority)?.textColor}>{priorityOptions.find((f) => f.option === priority)?.label}</Text>
          </AutoLayout>
        </AutoLayout>
        <AutoLayout width={145} horizontalAlignItems={"end"}>
          <AutoLayout fill={themeColors.find((f) => f.option === theme)?.color} padding={4} cornerRadius={4}>
            <Text fontSize={8} fontWeight={400} fill={themeColors.find((f) => f.option === theme)?.textColor}>{themeOptions.find((f) => f.option === theme)?.label}</Text>
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
      <Input
        fontSize={18}
        fontFamily="Roboto"
        height="hug-contents"
        horizontalAlignText="left"
        inputBehavior="multiline"
        onTextEditEnd={(e) => setHeadline(e.characters)}
        value={headline}
        fontWeight={600}
        width={300}
        />  
      <AutoLayout strokeAlign={"inside"} stroke={'#FFF'}  width={300} height={1} />
      <Input
        fontSize={12}
        height="hug-contents"
        fontFamily="Roboto"
        horizontalAlignText="left"
        inputBehavior="multiline"
        onTextEditEnd={(e) => setText(e.characters)}
        value={text}
        fontWeight={400}
        width="fill-parent"
        />  
      <AutoLayout strokeAlign={"inside"} stroke={'#FFF'}  width={300} height={1} />

      <AutoLayout fill={statusColors.find((f) => f.option.toUpperCase() === statusOption.toUpperCase())?.color} cornerRadius={4} padding={4} spacing={4} width={300} horizontalAlignItems={"center"} verticalAlignItems={"center"}>
          <Text fontSize={8} fontWeight={400} fill={statusColors.find((f) => f.option.toUpperCase() === statusOption.toUpperCase())?.textColor}>{statusColors.find((f) => f.option.toUpperCase() === statusOption.toUpperCase())?.tooltip}</Text>
          <SVG
            src={statusSvg}
          />
      </AutoLayout>
      <AutoLayout strokeAlign={"inside"} stroke={'#FFF'}  width={300} height={1} />
      <AutoLayout strokeAlign={"inside"} stroke={'#E6E6E6'}  width={300} height={1} />
      <AutoLayout strokeAlign={"inside"} stroke={'#FFF'}  width={300} height={1} />
      <AutoLayout direction="horizontal" spacing={8} width={300}>
        <AutoLayout width={93} horizontalAlignItems={"start"}>
          <AutoLayout fill={effortColors.find((f) => f.option === effort)?.color} cornerRadius={4} padding={4} spacing={4} verticalAlignItems={"center"}>
            <Text fontSize={8} fontWeight={400} fill={effortColors.find((f) => f.option === effort)?.textColor}>{effortOptions.find((f) => f.option === effort)?.label}</Text>
            <SVG
              src={effortSvg}
            />
          </AutoLayout>
        </AutoLayout>
        <AutoLayout width={93} horizontalAlignItems={"center"}>
          <AutoLayout fill={impactColors.find((f) => f.option === impact)?.color} cornerRadius={4} padding={4} spacing={4} verticalAlignItems={"center"}>
            <Text fontSize={8} fontWeight={400} fill={impactColors.find((f) => f.option === impact)?.textColor}>{impactOptions.find((f) => f.option === impact)?.label}</Text>
            <SVG
              src={impactSvg}
            />
          </AutoLayout>
        </AutoLayout>
        <AutoLayout width={93} horizontalAlignItems={"end"}>
          <AutoLayout fill={confidenceColors.find((f) => f.option === confidence)?.color} cornerRadius={4} padding={4} spacing={4} verticalAlignItems={"center"}>
            <Text fontSize={8} fontWeight={400} fill={confidenceColors.find((f) => f.option === confidence)?.textColor}>{confidenceOptions.find((f) => f.option === confidence)?.label}</Text>
            <SVG
              src={confidenceSvg}
            />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  )
}
widget.register(Widget)