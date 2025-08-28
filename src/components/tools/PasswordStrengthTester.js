import React, { useState, useEffect, useRef } from 'react';
import { FiShield, FiAlertTriangle, FiEye, FiEyeOff, FiLock, FiCheckCircle, FiXCircle, FiZap } from 'react-icons/fi';

// Mock useTheme hook for demo - replace with your actual implementation
const useTheme = () => {
  const [theme, setTheme] = useState('light');
  return { theme, setTheme };
};

export default function PasswordStrengthTester() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const { theme } = useTheme();
  const resultsRef = useRef(null);

  // SEO metadata effect
  useEffect(() => {
    document.title = 'Password Strength Tester - Test Your Password Security Online';
    
    // Create or update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Free online password strength tester tool. Check password security, get strength score, and receive tips to create stronger passwords. Test password complexity instantly.';

    // Create or update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;

    return () => {
      document.title = 'Password Strength Tester';
    };
  }, []);

  const getPasswordStrength = (pwd) => {
    if (!pwd) return null;

    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      longLength: pwd.length >= 12,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      numbers: /\d/.test(pwd),
      symbols: /[^A-Za-z0-9]/.test(pwd),
      noSequence: !/012|123|234|345|456|567|678|789|890|abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/i.test(pwd),
      noCommon: !/(password|123456|qwerty|admin|letmein|welcome|monkey|dragon|master|shadow|football|baseball|basketball|superman|batman|princess|sunshine|rainbow|flower|love|heart)/i.test(pwd)
    };

    // Calculate score
    if (checks.length) score += 10;
    if (checks.longLength) score += 15;
    if (checks.uppercase) score += 10;
    if (checks.lowercase) score += 10;
    if (checks.numbers) score += 10;
    if (checks.symbols) score += 15;
    if (checks.noSequence) score += 15;
    if (checks.noCommon) score += 15;

    // Additional points for very long passwords
    if (pwd.length >= 16) score += 10;
    if (pwd.length >= 20) score += 10;

    let level, color, icon, joke, tips;

    if (score < 30) {
      level = 'Very Weak';
      color = 'red';
      icon = FiXCircle;
      joke = "This password is so weak, it probably gets picked on by CAPTCHA codes! 🤖";
    } else if (score < 50) {
      level = 'Weak';
      color = 'orange';
      icon = FiAlertTriangle;
      joke = "Your password has the strength of a wet paper towel in a hurricane! 🌪️";
    } else if (score < 70) {
      level = 'Fair';
      color = 'yellow';
      icon = FiAlertTriangle;
      joke = "It's like a screen door on a submarine - better than nothing, but... 🚪";
    } else if (score < 85) {
      level = 'Good';
      color = 'blue';
      icon = FiShield;
      joke = "Not bad! Your password could probably bench press a dictionary! 💪";
    } else if (score < 95) {
      level = 'Strong';
      color = 'green';
      icon = FiShield;
      joke = "Solid! This password could probably survive a zombie apocalypse! 🧟‍♂️";
    } else {
      level = 'Very Strong';
      color = 'emerald';
      icon = FiZap;
      joke = "Wow! This password is so strong, it probably has its own security detail! 🕴️";
    }

    // Generate tips
    tips = [];
    if (!checks.length) tips.push("Use at least 8 characters");
    if (!checks.longLength) tips.push("Consider using 12+ characters for better security");
    if (!checks.uppercase) tips.push("Add uppercase letters (A-Z)");
    if (!checks.lowercase) tips.push("Add lowercase letters (a-z)");
    if (!checks.numbers) tips.push("Include numbers (0-9)");
    if (!checks.symbols) tips.push("Add symbols (!@#$%^&*)");
    if (!checks.noSequence) tips.push("Avoid sequential characters (123, abc)");
    if (!checks.noCommon) tips.push("Avoid common passwords");

    return {
      score,
      level,
      color,
      icon,
      joke,
      tips,
      checks
    };
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setStrength(getPasswordStrength(newPassword));
    setShowResults(newPassword.length > 0);
  };

  const scrollToResults = () => {
    if (resultsRef.current && showResults) {
      resultsRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }
  };

  useEffect(() => {
    if (showResults && strength) {
      setTimeout(scrollToResults, 100);
    }
  }, [showResults, strength]);

  const getColorClasses = (color) => {
    const colorMap = {
      red: 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20',
      orange: 'text-orange-600 dark:text-orange-400 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
      yellow: 'text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20',
      blue: 'text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
      green: 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
      emerald: 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20'
    };
    return colorMap[color] || colorMap.red;
  };

  const getProgressColor = (color) => {
    const progressMap = {
      red: 'bg-red-500',
      orange: 'bg-orange-500',
      yellow: 'bg-yellow-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      emerald: 'bg-emerald-500'
    };
    return progressMap[color] || progressMap.red;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors duration-200">
      <div className="max-w-4xl mx-auto">
        {/* Main Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                <FiLock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Password Strength Tester
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
              Test your password strength instantly and get personalized security recommendations with a touch of humor!
            </p>
          </div>

          {/* Password Input */}
          <div className="max-w-md mx-auto mb-8">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Enter your password to test
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Type your password here..."
                className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                         text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                         transition-colors duration-200"
              >
                {showPassword ? (
                  <FiEyeOff className="w-5 h-5" />
                ) : (
                  <FiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          {showResults && strength && (
            <div ref={resultsRef} className="max-w-2xl mx-auto">
              <div className={`p-6 rounded-2xl border-2 ${getColorClasses(strength.color)} mb-6`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <strength.icon className={`w-6 h-6 text-${strength.color}-600 dark:text-${strength.color}-400`} />
                    <span className="text-xl font-semibold">
                      {strength.level}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {strength.score}/100
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(strength.color)}`}
                    style={{ width: `${Math.min(strength.score, 100)}%` }}
                  ></div>
                </div>

                {/* Joke */}
                <div className="text-center p-4 bg-white dark:bg-gray-700/50 rounded-xl mb-4">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">
                    {strength.joke}
                  </p>
                </div>

                {/* Security Checks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {Object.entries({
                    'Length (8+ chars)': strength.checks.length,
                    'Long Length (12+ chars)': strength.checks.longLength,
                    'Uppercase Letters': strength.checks.uppercase,
                    'Lowercase Letters': strength.checks.lowercase,
                    'Numbers': strength.checks.numbers,
                    'Special Characters': strength.checks.symbols,
                    'No Common Sequences': strength.checks.noSequence,
                    'Avoids Common Passwords': strength.checks.noCommon
                  }).map(([check, passed]) => (
                    <div key={check} className="flex items-center space-x-2">
                      {passed ? (
                        <FiCheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <FiXCircle className="w-4 h-4 text-red-500" />
                      )}
                      <span className={`text-sm ${passed ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                        {check}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tips */}
                {strength.tips.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                      💡 Suggestions to improve:
                    </h4>
                    <ul className="space-y-1">
                      {strength.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400 flex items-center space-x-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            About Password Strength Testing
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Our Password Strength Tester is a comprehensive tool designed to evaluate the security of your passwords in real-time. 
              Using advanced algorithms, we analyze multiple factors including length, character diversity, common patterns, and 
              dictionary attacks to provide you with an accurate strength assessment.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              The tool checks for essential security criteria such as minimum length requirements, the presence of uppercase and 
              lowercase letters, numbers, special characters, and helps you avoid common password mistakes like sequential 
              characters or easily guessable patterns. All analysis happens locally in your browser - your password never 
              leaves your device, ensuring complete privacy and security.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
              Beyond just scoring your password, our tool provides actionable recommendations to strengthen weak passwords and 
              includes humorous feedback to make security education more engaging. Whether you're creating a new password or 
              auditing existing ones, this tool helps you maintain better digital security practices.
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Strong passwords are your first line of defense against cyber threats. Use this tool regularly to ensure your 
              accounts remain secure, and remember to use unique passwords for different services along with two-factor 
              authentication whenever possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}