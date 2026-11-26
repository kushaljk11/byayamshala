import { Badge, Button, Container, Heading, Section, Text } from "@/components/ui";

export default function HomePage() {
  return (
    <Section>
      <Container className="flex flex-col items-start gap-6">
        <Badge>Setup complete</Badge>
        <Heading as="h1">Byamshala</Heading>
        <Text size="lg" muted className="max-w-2xl">
          Next.js + TypeScript + Tailwind CSS. Pages will be built from the
          Figma frames using the reusable components in src/components/ui.
        </Text>
        <div className="flex gap-3">
          <Button>Primary</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </Container>
    </Section>
  );
}
