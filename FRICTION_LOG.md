# Developer Friction Log: Ring Developer Playground Onboarding

- **Task Attempted:** Accessing the Ring Developer Playground to test device discovery and event endpoints.
- **Steps Taken:** Logged into developer.amazon.com -> navigated to Ring Developer portal -> attempted to launch the Playground.
- **Expected vs. Actual:** Expected an instant sandbox environment to test sample payloads; instead encountered a mandatory government passport/ID upload requirement (KYC) just to try out sandbox APIs.
- **Severity Rating:** High (creates significant onboarding friction for independent developers and rapid hackathon prototyping).
- **Workaround Used:** Adapted official Ring JSON:API schemas from the `AmazonAppDev/ring-api-helloworld` starter and built an autonomous local test harness with 4 pre-configured care scenarios to evaluate the safety engine locally.
- **Actionable Suggestion:** Provide an open, friction-free sandbox environment with preloaded mock devices that developers can test immediately upon creating an account, without requiring passport verification.