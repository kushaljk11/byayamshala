import { Container, Text } from "@/components/ui";
import { siteConfig } from "@/constants/site";

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <Container>
        <Text size="sm" muted>
          © {siteConfig.year} {siteConfig.name}. All rights reserved.
        </Text>
      </Container>
    </footer>
  );
}
