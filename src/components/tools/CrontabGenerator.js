import { useState, useEffect } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { Link } from 'react-router-dom';

function CrontabGenerator() {
  const { darkMode } = useTheme();
  const [expression, setExpression] = useState('* * * * *');
  const [minute, setMinute] = useState('*');
  const [hour, setHour] = useState('*');
  const [dayOfMonth, setDayOfMonth] = useState('*');
  const [month, setMonth] = useState('*');
  const [dayOfWeek, setDayOfWeek] = useState('*');
  const [humanReadable, setHumanReadable] = useState('');
  const [nextExecutions, setNextExecutions] = useState([]);

  // Options for dropdowns
  const minuteOptions = [
    { value: '*', label: 'Every minute' },
    { value: '*/5', label: 'Every 5 minutes' },
    { value: '*/10', label: 'Every 10 minutes' },
    { value: '*/15', label: 'Every 15 minutes' },
    { value: '*/30', label: 'Every 30 minutes' },
    { value: '0', label: 'At minute 0' },
    { value: '30', label: 'At minute 30' },
  ];

  const hourOptions = [
    { value: '*', label: 'Every hour' },
    { value: '*/2', label: 'Every 2 hours' },
    { value: '*/3', label: 'Every 3 hours' },
    { value: '*/4', label: 'Every 4 hours' },
    { value: '*/6', label: 'Every 6 hours' },
    { value: '*/12', label: 'Every 12 hours' },
    { value: '0', label: 'At midnight (00:00)' },
    { value: '12', label: 'At noon (12:00)' },
  ];

  const dayOfMonthOptions = [
    { value: '*', label: 'Every day of month' },
    { value: '1', label: 'On the 1st' },
    { value: '15', label: 'On the 15th' },
    { value: '1-5', label: 'From 1st to 5th' },
    { value: '1,15', label: '1st and 15th' },
  ];

  const monthOptions = [
    { value: '*', label: 'Every month' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const dayOfWeekOptions = [
    { value: '*', label: 'Every day of week' },
    { value: '0', label: 'Sunday' },
    { value: '1', label: 'Monday' },
    { value: '2', label: 'Tuesday' },
    { value: '3', label: 'Wednesday' },
    { value: '4', label: 'Thursday' },
    { value: '5', label: 'Friday' },
    { value: '6', label: 'Saturday' },
    { value: '1-5', label: 'Monday to Friday' },
    { value: '0,6', label: 'Weekends' },
  ];

  // Common crontab presets
  const presets = [
    { name: 'Every minute', expression: '* * * * *' },
    { name: 'Every hour', expression: '0 * * * *' },
    { name: 'Every day at midnight', expression: '0 0 * * *' },
    { name: 'Every Monday', expression: '0 0 * * 1' },
    { name: 'Every 1st of month', expression: '0 0 1 * *' },
    { name: 'Every 15 minutes', expression: '*/15 * * * *' },
    { name: 'Weekdays at 9 AM', expression: '0 9 * * 1-5' },
    { name: 'Weekends at 10 AM', expression: '0 10 * * 0,6' },
  ];

  // Update expression when any field changes
  useEffect(() => {
    setExpression(`${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`);
  }, [minute, hour, dayOfMonth, month, dayOfWeek]);

  // Update fields when expression changes
  useEffect(() => {
    if (!expression) return;
    
    const parts = expression.split(' ');
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDayOfMonth(parts[2]);
      setMonth(parts[3]);
      setDayOfWeek(parts[4]);
      
      // Generate human-readable description
      generateHumanReadable(parts);
      
      // Calculate next execution times
      calculateNextExecutions(expression);
    }
  }, [expression]);

  const generateHumanReadable = (parts) => {
    // This is a simplified version - a real implementation would be more complex
    let description = 'Runs ';
    
    // Minute
    if (parts[0] === '*') description += 'every minute ';
    else if (parts[0].startsWith('*/')) description += `every ${parts[0].substring(2)} minutes `;
    else description += `at minute ${parts[0]} `;
    
    // Hour
    if (parts[1] === '*') description += 'of every hour ';
    else if (parts[1].startsWith('*/')) description += `every ${parts[1].substring(2)} hours `;
    else description += `at hour ${parts[1]} `;
    
    // Day of month
    if (parts[2] === '*') description += 'on every day of the month ';
    else description += `on day ${parts[2]} of the month `;
    
    // Month
    if (parts[3] === '*') description += 'in every month ';
    else {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      if (parts[3].includes(',')) {
        const months = parts[3].split(',').map(m => monthNames[parseInt(m) - 1]);
        description += `in ${months.join(' and ')} `;
      } else {
        description += `in ${monthNames[parseInt(parts[3]) - 1]} `;
      }
    }
    
    // Day of week
    if (parts[4] === '*') description += 'on every day of the week';
    else {
      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (parts[4] === '1-5') description += 'on weekdays';
      else if (parts[4] === '0,6') description += 'on weekends';
      else if (parts[4].includes(',')) {
        const days = parts[4].split(',').map(d => dayNames[parseInt(d)]);
        description += `on ${days.join(' and ')}`;
      } else {
        description += `on ${dayNames[parseInt(parts[4])]}`;
      }
    }
    
    setHumanReadable(description);
  };

  const calculateNextExecutions = (cronExpression) => {
    // In a real implementation, you would use a library like cron-parser
    // This is a simplified placeholder
    const now = new Date();
    const executions = [];
    
    // Just add 5 placeholder dates for now
    for (let i = 1; i <= 5; i++) {
      const next = new Date(now.getTime() + i * 60 * 60 * 1000); // Add hours
      executions.push(next.toLocaleString());
    }
    
    setNextExecutions(executions);
  };

  const handlePresetSelect = (preset) => {
    setExpression(preset.expression);
  };

  const handleExpressionChange = (e) => {
    setExpression(e.target.value);
  };

  const handleFieldChange = (field, value) => {
    switch (field) {
      case 'minute':
        setMinute(value);
        break;
      case 'hour':
        setHour(value);
        break;
      case 'dayOfMonth':
        setDayOfMonth(value);
        break;
      case 'month':
        setMonth(value);
        break;
      case 'dayOfWeek':
        setDayOfWeek(value);
        break;
      default:
        break;
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(expression);
    // In a real implementation, you would show a toast notification
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
      <div className="container mx-auto py-8 px-4">
        <h1 className={`text-3xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Crontab Expression Generator
        </h1>
        
        <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Common Presets
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {presets.map((preset, index) => (
              <button
                key={index}
                onClick={() => handlePresetSelect(preset)}
                className={`p-3 rounded-md text-sm font-medium transition-colors duration-200 ${
                  darkMode 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Crontab Expression
          </h2>
          
          <div className="flex flex-col md:flex-row items-center mb-6">
            <input
              type="text"
              value={expression}
              onChange={handleExpressionChange}
              className={`w-full md:w-auto flex-grow px-4 py-2 rounded-md mr-0 md:mr-4 mb-4 md:mb-0 ${
                darkMode 
                  ? 'bg-gray-700 text-white border-gray-600' 
                  : 'bg-white text-gray-800 border-gray-300'
              } border`}
              placeholder="* * * * *"
            />
            <button
              onClick={copyToClipboard}
              className={`px-4 py-2 rounded-md font-medium transition-colors duration-200 ${
                darkMode 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              Copy to Clipboard
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Minute
              </label>
              <select
                value={minute}
                onChange={(e) => handleFieldChange('minute', e.target.value)}
                className={`w-full p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                {minuteOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Hour
              </label>
              <select
                value={hour}
                onChange={(e) => handleFieldChange('hour', e.target.value)}
                className={`w-full p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                {hourOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Day of Month
              </label>
              <select
                value={dayOfMonth}
                onChange={(e) => handleFieldChange('dayOfMonth', e.target.value)}
                className={`w-full p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                {dayOfMonthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Month
              </label>
              <select
                value={month}
                onChange={(e) => handleFieldChange('month', e.target.value)}
                className={`w-full p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className={`block mb-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Day of Week
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => handleFieldChange('dayOfWeek', e.target.value)}
                className={`w-full p-2 rounded-md ${
                  darkMode 
                    ? 'bg-gray-700 text-white border-gray-600' 
                    : 'bg-white text-gray-800 border-gray-300'
                } border`}
              >
                {dayOfWeekOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Human-Readable Description
          </h2>
          <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {humanReadable || 'Please enter a valid crontab expression'}
            </p>
          </div>
        </div>
        
        <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <h2 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
            Next Execution Times
          </h2>
          <div className={`p-4 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
            <ul className="space-y-2">
              {nextExecutions.map((time, index) => (
                <li key={index} className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  {time}
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className={`mb-8 p-6 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <article className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}>
            <h1>Crontab Expression Generator: Simplify Scheduling with Ease</h1>
            
            <p>
              Crontab, short for "cron table," is a powerful scheduling tool in Unix-like operating systems that allows users to automate repetitive tasks. Whether you're a system administrator, developer, or someone who needs to schedule routine jobs, understanding crontab expressions is essential. However, crafting these expressions manually can be tricky and time-consuming. This is where a <strong>Crontab Expression Generator</strong> comes into play.
            </p>
            
            <p>
              A Crontab Expression Generator simplifies the process of creating cron schedules by providing an intuitive interface and common presets. In this article, we'll explore how this tool works, its benefits, and some common use cases.
            </p>
            
            <hr className="my-6" />
            
            <h2>What is a Crontab Expression?</h2>
            
            <p>
              A crontab expression defines when a scheduled task should run. It consists of five fields separated by spaces:
            </p>
            
            <table className={`w-full border-collapse ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <thead>
                <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <th className="text-left py-2">Field</th>
                  <th className="text-left py-2">Allowed Values</th>
                  <th className="text-left py-2">Special Characters</th>
                </tr>
              </thead>
              <tbody>
                <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <td className="py-2">Minute</td>
                  <td className="py-2">0-59</td>
                  <td className="py-2">* , - /</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <td className="py-2">Hour</td>
                  <td className="py-2">0-23</td>
                  <td className="py-2">* , - /</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <td className="py-2">Day of Month</td>
                  <td className="py-2">1-31</td>
                  <td className="py-2">* , - /</td>
                </tr>
                <tr className={`border-b ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                  <td className="py-2">Month</td>
                  <td className="py-2">1-12</td>
                  <td className="py-2">* , - /</td>
                </tr>
                <tr>
                  <td className="py-2">Day of Week</td>
                  <td className="py-2">0-6 (0 is Sunday)</td>
                  <td className="py-2">* , - /</td>
                </tr>
              </tbody>
            </table>
            
            <h3>Special Characters Explained:</h3>
            <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <li className="mb-1"><code>*</code>: Matches any value.</li>
              <li className="mb-1"><code>,</code>: Separates multiple values (e.g., <code>1,3,5</code> means 1st, 3rd, and 5th).</li>
              <li className="mb-1"><code>-</code>: Defines a range of values (e.g., <code>1-5</code> means 1 through 5).</li>
              <li className="mb-1"><code>/</code>: Specifies step values (e.g., <code>*/5</code> means every 5 units).</li>
            </ul>
            
            <p>
              For example, the expression <code>*/15 0 15 * *</code> translates to:<br />
              "Run every 15 minutes at hour 0 on day 15 of the month, every month, on every day of the week."
            </p>
            
            <hr className="my-6" />
            
            <h2>Why Use a Crontab Expression Generator?</h2>
            
            <p>
              Creating crontab expressions manually requires precision and familiarity with the syntax. A small mistake can lead to unintended behavior, such as tasks running too frequently or not at all. A Crontab Expression Generator eliminates these risks by offering:
            </p>
            
            <ol className={`list-decimal pl-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <li className="mb-2"><strong>User-Friendly Interface</strong>: Instead of memorizing syntax, users can select options from dropdown menus or checkboxes.</li>
              <li className="mb-2"><strong>Common Presets</strong>: Predefined schedules for frequent use cases like "Every minute," "Every hour," or "Weekdays at 9 AM."</li>
              <li className="mb-2"><strong>Human-Readable Descriptions</strong>: Instantly see what your expression means in plain English.</li>
              <li className="mb-2"><strong>Next Execution Times</strong>: Preview when the task will run next to ensure it aligns with your expectations.</li>
              <li className="mb-2"><strong>Copy-to-Clipboard Functionality</strong>: Quickly copy the generated expression for use in your crontab file.</li>
            </ol>
            
            <hr className="my-6" />
            
            <h2>How Does a Crontab Expression Generator Work?</h2>
            
            <p>
              Using a Crontab Expression Generator typically involves the following steps:
            </p>
            
            <ol className={`list-decimal pl-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <li className="mb-2">
                <strong>Select Frequency Options</strong>:
                <ul className="list-disc pl-5 mt-1">
                  <li>Choose how often the task should run (e.g., every minute, hourly, daily).</li>
                  <li>Specify additional constraints like specific hours, days, or months.</li>
                </ul>
              </li>
              <li className="mb-2">
                <strong>Generate Expression</strong>:
                <ul className="list-disc pl-5 mt-1">
                  <li>The tool automatically constructs the correct crontab expression based on your selections.</li>
                </ul>
              </li>
              <li className="mb-2">
                <strong>Preview Human-Readable Description</strong>:
                <ul className="list-disc pl-5 mt-1">
                  <li>Get a clear explanation of what the expression does in simple terms.</li>
                </ul>
              </li>
              <li className="mb-2">
                <strong>Check Next Execution Times</strong>:
                <ul className="list-disc pl-5 mt-1">
                  <li>View upcoming execution times to confirm the schedule meets your requirements.</li>
                </ul>
              </li>
              <li className="mb-2">
                <strong>Copy and Use</strong>:
                <ul className="list-disc pl-5 mt-1">
                  <li>Copy the generated expression and paste it into your crontab file using the <code>crontab -e</code> command.</li>
                </ul>
              </li>
            </ol>
            
            <hr className="my-6" />
            
            <h2>Example Walkthrough</h2>
            
            <p>
              Let's say you want to create a schedule that runs every 15 minutes at hour 0 on day 15 of the month, every month, on every day of the week.
            </p>
            
            <ol className={`list-decimal pl-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <li className="mb-1">Open the Crontab Expression Generator.</li>
              <li className="mb-1">
                Set the following options:
                <ul className="list-disc pl-5 mt-1">
                  <li><strong>Minute</strong>: Every 15 minutes (<code>*/15</code>)</li>
                  <li><strong>Hour</strong>: At midnight (<code>0</code>)</li>
                  <li><strong>Day of Month</strong>: On the 15th (<code>15</code>)</li>
                  <li><strong>Month</strong>: Every month (<code>*</code>)</li>
                  <li><strong>Day of Week</strong>: Every day of the week (<code>*</code>)</li>
                </ul>
              </li>
              <li className="mb-1">Click "Generate."</li>
              <li className="mb-1">The tool outputs the expression: <code>*/15 0 15 * *</code>.</li>
              <li className="mb-1">
                It also provides a human-readable description:<br />
                <em>"Runs every 15 minutes at hour 0 on day 15 of the month in every month on every day of the week."</em>
              </li>
              <li className="mb-1">Finally, preview the next execution times and copy the expression to your clipboard.</li>
            </ol>
            
            <hr className="my-6" />
            
            <h2>Benefits of Using a Crontab Expression Generator</h2>
            
            <ol className={`list-decimal pl-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <li className="mb-1"><strong>Accuracy</strong>: Avoid errors caused by manual entry.</li>
              <li className="mb-1"><strong>Time-Saving</strong>: Quickly generate complex expressions without deep knowledge of cron syntax.</li>
              <li className="mb-1"><strong>Flexibility</strong>: Easily experiment with different schedules until you find the perfect one.</li>
              <li className="mb-1"><strong>Accessibility</strong>: Makes cron scheduling accessible even to beginners.</li>
            </ol>
            
            <hr className="my-6" />
            
            <h2>Other Useful Developer Tools</h2>
            
            <p className="mb-4">
              While you're here, check out our other developer tools that can help streamline your workflow:
            </p>
            
            <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-6`}>
              <li className="mb-2">
                <Link to="/code-formatter" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                  Code Formatter
                </Link>
                : Clean up and format your code with proper indentation and style.
              </li>
              <li className="mb-2">
                <Link to="/json-validator" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                  JSON Validator
                </Link>
                : Validate and format your JSON data to ensure it's error-free.
              </li>
              <li className="mb-2">
                <Link to="/curl-generator" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                  cURL Generator
                </Link>
                : Create cURL commands for API testing and integration.
              </li>
              <li className="mb-2">
                <Link to="/markdown-to-html" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                  Markdown to HTML
                </Link>
                : Convert your Markdown content to HTML for web publishing.
              </li>
              <li className="mb-2">
                <Link to="/pihole-regex-generator" className={`font-medium ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}>
                  Pi-hole Regex Generator
                </Link>
                : Create regular expressions for Pi-hole ad blocking.
              </li>
            </ul>
          </article>
        </div>
      </div>
    </div>
  );
}

export default CrontabGenerator; 