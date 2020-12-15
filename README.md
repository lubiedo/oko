

<p align="center">
<img width="200"
  src="https://raw.githubusercontent.com/lubiedo/oko/main/logo.png" />
</p>

# oko
Simplistic approach to getting rid of tracker tokens.

## What?
oko removes query parameters from GET requests and cookies from HTTP(S) requests/responses. To see what's currently being removed, check both `query_params` and `cookie_params` which contains regular expressions of a set of possible targets.

The extension can be enabled or disabled by clicking in the icon.

> **Should this be a replacement for other anti-tracking-tokens solutions?**
>
> No. Not even close. Get [better web](https://www.mozilla.org/en-US/firefox/new/) [browsers](https://brave.com/) or even [better extensions](https://www.eff.org/privacybadger).

## Installation
1. Visit `chrome://extensions`
2. Toggle the developer mode ON
3. Download the releases ZIP file and extract
4. `Load unpacked` to load the extension

## TODO
- [ ] More testing!
- [ ] Keep a list of parameters being removed in this README.
