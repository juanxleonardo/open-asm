import * as net from 'node:net';

function isPrivateV4(ip: string): boolean {
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true;
  if (a === 0) return true;
  return false;
}

function isPrivateV6(ip: string): boolean {
  const normalized = ip.toLowerCase();
  if (normalized === '::1' || normalized === '0:0:0:0:0:0:0:1') return true;
  if (normalized === '::' || normalized === '0:0:0:0:0:0:0:0') return true;
  if (normalized.startsWith('fe80:')) return true;
  if (normalized.startsWith('fc') || normalized.startsWith('fd')) return true;
  const v4mapped = normalized.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if (v4mapped) return isPrivateV4(v4mapped[1]);
  return false;
}

function isPrivateAddress(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateV4(ip);
  if (net.isIPv6(ip)) return isPrivateV6(ip);
  return false;
}

describe('isPrivateAddress', () => {
  describe('IPv4', () => {
    it.each([
      ['10.0.0.1', true],
      ['127.0.0.1', true],
      ['172.16.0.1', true],
      ['172.31.255.255', true],
      ['192.168.0.1', true],
      ['169.254.1.1', true],
      ['100.64.0.1', true],
      ['100.127.255.255', true],
      ['0.0.0.0', true],
      ['8.8.8.8', false],
      ['1.1.1.1', false],
      ['172.15.0.1', false],
      ['172.32.0.1', false],
      ['192.167.255.255', false],
      ['100.63.255.255', false],
      ['100.128.0.1', false],
    ])('should detect %s as private=%s', (ip, expected) => {
      expect(isPrivateAddress(ip)).toBe(expected);
    });
  });

  describe('IPv6', () => {
    it.each([
      ['::1', true],
      ['0:0:0:0:0:0:0:1', true],
      ['::', true],
      ['fe80::1', true],
      ['fc00::1', true],
      ['fd00::1', true],
      ['fdff:ffff:ffff:ffff:ffff:ffff:ffff:ffff', true],
      ['::ffff:127.0.0.1', true],
      ['::ffff:10.0.0.1', true],
      ['::ffff:192.168.1.1', true],
      ['2001:db8::1', false],
      ['2606:4700:4700::1111', false],
    ])('should detect %s as private=%s', (ip, expected) => {
      expect(isPrivateAddress(ip)).toBe(expected);
    });
  });
});
